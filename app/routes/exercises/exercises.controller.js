//@ts-check
const mongoose = require("mongoose");
const _ = require("lodash");
const Exercise = mongoose.model("Exercise");
const {isAuthenticated} = require("../../middleware");
/**
 * Exercises Contoller
 * @param {object} router
 */
module.exports = (router) => {
    router.post("/exercises",
        isAuthenticated,
        /**
         * @param {object} req
         * @param {object} res
         */
        async (req, res) => {
            let ids = req.body.ids;
            
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

            res.status(200).send(ids);
        },
    );
};