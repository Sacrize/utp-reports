//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const {isAuthenticated} = require("../../middleware");
const {isTeacher} = require("../../middleware");
const multiparty = require('connect-multiparty')();
const Gridfs = require("gridfs-stream");
const config = require("../../config");
const clam = require("clamav.js");
const fs = require('fs');

/**
 * Exercises Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.get("/exercise",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let ids = req.query.ids;
            
            if (_.isArray(ids) === false) {
                return res.status(400).send("bad request");
            }

            try {

                let exercises = await Exercise.find()
                    .where({ _id: ids, });

                return res.status(200).json(exercises);
                
            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
    router.get("/exercise/file",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let _id = req.query.exercise;
            
            if (!_.isString(_id)) {
                return res.status(400).send("bad request");
            }

            try {

                let exercise = await Exercise.findOne()
                    .where({ _id: _id, });

                if (Boolean(exercise.file) === false) {
                    return res.status(404).send("not found");
                }

                const db = mongoose.connection.db;
                const mongoDriver = mongoose.mongo;
                const gfs = new Gridfs(db, mongoDriver);

                gfs.files.find({ _id: exercise.file }).toArray(function (err, files) {
                    if (err) throw err;

                    let readstream = gfs.createReadStream({
                        _id: files[0]._id,
                    });
    
                    let extension = /(?:\.([^.]+))?$/.exec(files[0].filename)[1];
                    let filename = exercise.file + "." + extension;

                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);

                    readstream.pipe(res);
                });

            } catch (error) {
                console.log(error);
                return res.status(500).send("server error");
            }
        },
    );
    router.post("/exercise",
        isAuthenticated,
        isTeacher,
        multiparty,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let name = req.body.name;
            let description = req.body.description;
            let branch = req.body.branch;
            let specialization = req.body.specialization;
            let typeOfStudy = req.body.typeOfStudy;
            let semester = req.body.semester;

            const db = mongoose.connection.db;
            const mongoDriver = mongoose.mongo;
            const gfs = new Gridfs(db, mongoDriver);

            let file = undefined;
            if (req.files && req.files.attachment) {
                try {
                    file = await new Promise((resolve, reject) => {
                        clam.createScanner(3310, 'clamav').scan(req.files.attachment.path, (err, object, malicious) => {
                            if (err) return reject(err);
                
                            if (malicious) {
                            return reject(new Error('Abort. File is infected.'));
                            }
                
                            const writestream = gfs.createWriteStream({
                                filename: req.files.attachment.name,
                                content_type: req.files.attachment.mimetype,
                                mode: 'w'
                            });
                
                            fs.createReadStream(req.files.attachment.path).pipe(writestream);
                
                            writestream.on('close', (file) => {
                                fs.unlinkSync(req.files.attachment.path);
                                return resolve(file);
                            });
                        });
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).send("server error");
                }
            }

            let exercise = new Exercise({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                description: description,
                branch: branch,
                specialization: specialization,
                typeOfStudy: typeOfStudy,
                semester: semester,
                owner: req.session.user._id,
                file: file ? file._id : null,
            });
            
            try {

                await exercise.save();
                return res.status(200).json(exercise);
                
            } catch (error) {
                console.log(error);
                if (file) {
                    gfs.remove({
                        _id: file._id
                    }, (err, gridStore) => {
                        if (err) return console.log(err);
                        console.debug('Removed file from database after insert error.');
                    });
                }
                return res.status(500).send("server error");
            }
        },
    );
};