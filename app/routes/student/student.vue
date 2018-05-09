<template>
<div id="teacher">
    <navbar-for-logged>
        <template slot="right-menu">
            <li class="nav-item">
                <a class="btn btn-primary" href="/logout">Wyloguj</a>
            </li>
        </template>
    </navbar-for-logged>

    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-xs col-md-4">
                    <header>
                        <h4>Ćwiczenia</h4>
                        <hr />
                    </header>
                    <div id="tree" class="card mb-2" v-for="(branch, index1) in branches" v-bind:key="index1">
                        <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}`">
                            <div>{{ branch.name }}</div>
                        </button>
                        <div class="card-body collapse" :id="`tree-${index1}`">
                            <div class="card" v-for="(specialization, index2) in branch.specializations" v-bind:key="index2">
                                <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}-${index2}`">
                                    <div>{{ specialization.name }}</div>
                                </button>
                                <div class="card-body collapse" :id="`tree-${index1}-${index2}`">
                                    <div class="card" v-for="(typeOfStudy, index3) in specialization.typesOfStudy" v-bind:key="index3">
                                        <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}-${index2}-${index3}`">
                                            <div>{{ typeOfStudy.name }}</div>
                                        </button>
                                        <div class="card-body collapse" :id="`tree-${index1}-${index2}-${index3}`">
                                            <div class="card" v-for="(semester, index4) in typeOfStudy.semesters" v-bind:key="index4">
                                                <button class="card-header btn btn-link" v-on:click.prevent="getExercises(semester.exercises)" data-toggle="collapse" :href="`#tree-${index1}-${index2}-${index3}-${index4}`">
                                                    <div>{{ semester.name }}</div>
                                                </button>
                                                <div class="card-body collapse" :id="`tree-${index1}-${index2}-${index3}-${index4}`">
                                                    <div class="card" v-for="exerciseId in semester.exercises" v-bind:key="exerciseId">
                                                        <button class="card-body btn btn-link" v-on:click.prevent="showExerciseById = exerciseId">
                                                            <div class="d-flex justify-content-between">
                                                                <small>{{ readExerciseById(exerciseId).name }}</small>
                                                                <small>{{ readExerciseById(exerciseId).createdAt }}</small>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs col-md-8">
                    <header>
                        <h4>Podgląd ćwiczenia</h4>
                        <hr />
                    </header>
                    <div class="card" v-if="exercise">
                        <div class="card-body">
                            <h4 class="card-title">{{ exercise.name }}</h4>
                            <p>{{ exercise.description }}</p>
                                
                            <hr />

                            <button class="btn" v-on:click="fetchAttachment" v-if="exercise.file">Pobierz załącznik</button>
                            <button class="btn" data-toggle="modal" data-target="#uploadReportModal">Wyślij rozwiązanie</button>
                            
                            <div class="card mt-3">
                                <div class="card-header">
                                    <button class="btn btn-link" >Historia</button>
                                </div>
                                <div class="card-body">
                                    <div id="list">
                                        <div class="d-flex justify-content-end">
                                            <div class="dropdown">
                                            <button class="btn btn-link btn-xs dropdown-toggle" type="button" data-toggle="dropdown">
                                                Sortuj
                                            </button>
                                            <div class="dropdown-menu">
                                                <a class="dropdown-item" href="#">Action</a>
                                                <a class="dropdown-item" href="#">Another action</a>
                                                <a class="dropdown-item" href="#">Something else here</a>
                                            </div>
                                            </div>
                                        </div>

                                        <div id="list-reports">
                                            <ul class="list-group list-group-flush py-2">
                                                 <li class="list-group-item bg-light" v-for="report in historyOfUpload" v-bind:key="report._id">
                                                    <div class="d-flex justify-content-between">
                                                        <span><b>Status:</b> {{ report.status }}</span>
                                                        <small>{{ report.createdAt }}</small>
                                                    </div>
                                                    <div class="d-flex justify-content-end">

                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="d-flex justify-content-between">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <upload-report-modal :exercise="exercise"></upload-report-modal>
</div>
</template>

<script>
import navbar from "../navbar.vue";
import uploadReport from "../components/uploadReport.component.vue";
export default {
    components: {
        "navbar-for-logged": navbar,
        "upload-report-modal": uploadReport,
    },
    data: function() {
        return {
            branches: Array(),
            exercises: Array(),
            reports: Array(),
            showExerciseById: null,
            exercise: null,
            historyOfUpload: Array(),
            loadingExercises: false,
            loadingHistoryOfUpload: false,
        };
    },
    methods: {
        getExercises(ids) {
            this.loadingExercises = true;
            axios.get("http://localhost:9000/exercise", { params: {ids} }).then(
                response => {
                    this.loadingExercises = false;

                    if (response.data) {
                        response.data.map(exercise => {
                            let savedExercise = this.exercises.find(e => e._id === exercise._id);
                            if (Boolean(savedExercise) === false) {
                                exercise.createdAt = moment(exercise.createdAt).locale("pl").format("ll");
                                this.exercises.push(exercise);
                            }
                        })
                    }
                },
                error => {
                    this.loadingExercises = false;
                    console.log(error);
                }
            );
        },
        readExerciseById(id) {
            return this.exercises.find(v => v._id === id) || {};
        },
        getHistoryOfUpload(){
            this.loadingHistoryOfUpload = true;
            axios.get("http://localhost:9000/report/history", { params: { exercise: this.exercise._id } }).then(
                response => {
                    this.loadingHistoryOfUpload = false;

                    if (response.data) {
                        // transform date to readable
                        response.data.map(report => {
                            report.createdAt = moment(report.createdAt).locale("pl").format("lll");
                            return report;
                        });
                        this.historyOfUpload = response.data;
                    }
                },
                error => {
                    this.loadingHistoryOfUpload = false;
                    console.log(error);
                }
            );
        },
        fetchAttachment() {
            window.location = `http://localhost:9000/exercise/file?exercise=${this.exercise._id}`;
        }
    },
    computed: {
        
    },
    watch: {
        exercise(value) {
            if (value) this.getHistoryOfUpload();
        },
        showExerciseById(value) {
            if (value) {
                let exerciseToShow = this.exercises.find(e => e._id === value);
                this.exercise = exerciseToShow;
            } else {
                this.exercise = null;
            }
        }
    }
};
</script>

<style scoped>
#tree button.card-header {
  font-size: 0.7rem;
  overflow: hidden;
  text-align: left;
}

#tree .card-body {
  padding: 0;
}

.container {
  max-width: 1300px !important;
}

header > hr {
    margin-top: 0;
    margin-bottom: 2rem;
}

/* #tree .card {
    border: none !important;
} */
</style>