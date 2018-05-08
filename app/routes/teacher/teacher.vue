<template>
<div id="teacher">
    <navbar-for-logged>
        <template slot="right-menu">
            <li class="nav-item">
                <a class="btn btn-primary" href="javascript:" data-toggle="modal" data-target="#createExerciseModal">Dodaj ćwiczenie</a>
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
                                                        <div class="card-body">
                                                            <div class="d-flex justify-content-between">
                                                                <span>{{ readExerciseById(exerciseId).name }} <small>(4 / 20)</small></span>
                                                                <small>12.10.2017</small>
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
                    </div>
                </div>
                <div class="col-xs col-md-8">
                    <header>
                        <h4>Sprawozdania</h4>
                        <hr />
                    </header>
                    <div class="card">
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
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item bg-light">
                                            <div class="d-flex justify-content-between">
                                                <h5>Uczeń: Jan Kowalski</h5>
                                                <small>20.12.2018</small>
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button class="btn btn-link btn-sm">Oceń</button>
                                                <button class="btn btn-link btn-sm">Pobierz</button>
                                                <button class="btn btn-link btn-sm">Odrzuć</button>
                                                <button class="btn btn-link btn-sm">Akceptuj</button>
                                            </div>
                                        </li>
                                        <li class="list-group-item bg-light">
                                            <div class="d-flex justify-content-between">
                                                <h5>Uczeń: Jan Kowalski</h5>
                                                <small>20.12.2018</small>
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button class="btn btn-link btn-sm">Oceń</button>
                                                <button class="btn btn-link btn-sm">Pobierz</button>
                                                <button class="btn btn-link btn-sm">Odrzuć</button>
                                                <button class="btn btn-link btn-sm">Akceptuj</button>
                                            </div>
                                        </li>
                                        <li class="list-group-item bg-light">
                                            <div class="d-flex justify-content-between">
                                                <h5>Uczeń: Jan Kowalski</h5>
                                                <small>20.12.2018</small>
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button class="btn btn-link btn-sm">Oceń</button>
                                                <button class="btn btn-link btn-sm">Pobierz</button>
                                                <button class="btn btn-link btn-sm">Odrzuć</button>
                                                <button class="btn btn-link btn-sm">Akceptuj</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div class="pt-2 d-flex justify-content-between">

                                    <button class="btn btn-link btn-sm">Pobierz wszystkie</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal -->
    <div class="modal fade" id="createExerciseModal" tabindex="-1" role="dialog" >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Dodaj ćwiczenie</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-warning" v-if="loading">
                        <img src="/static/loader.svg" />
                        Trwa dodawanie, poczekaj jeszcze chwilę.
                    </div>
                    <div class="alert alert-success" v-if="status === 'success'">
                        Ćwiczenie zostało dodane pomyślnie.
                    </div>
                    <div class="alert alert-danger" v-else-if="status === 'error'">
                        Coś poszło nie tak.
                    </div>
                    <form v-on:submit.prevent="onSubmit">
                        <div class="form-group">
                            <label for="selectExistingClass">Klasa</label>
                            <select class="form-control" id="selectExistingClass" v-model="exercise.class">
                            <option 
                                v-for="studentClass in classes" 
                                v-bind:key="studentClass.uid" 
                                v-bind:value="studentClass.uid"
                            >{{ studentClass.name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="nameOfExercise">Nazwa</label>
                            <input type="text" class="form-control" id="nameOfExercise" placeholder="np. Ćwiczenie 1" v-model="exercise.name">
                        </div>
                        <div class="form-group">
                            <label for="descriptionOfExercise">Opis</label>
                            <textarea class="form-control" id="descriptionOfExercise" rows="3" v-model="exercise.description"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="attachmentOfExercise">Załącznik</label>
                            <input type="file" class="form-control-file" id="attachmentOfExercise">
                        </div>
                        <button type="submit" class="btn btn-primary">Zapisz</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import navbar from "../navbar.vue";
export default {
    components: {
        "navbar-for-logged": navbar
    },
    data: function() {
        return {
            branches: Array(),
            exercises: Array(),
            loading: false,
            exercise: { /* new exercise */ },
        };
    },
    methods: {
        getExercises(ids) {
            this.loading = true;
            axios.post("http://localhost:9000/exercises", { ids }).then(
                response => {
                    this.loading = false;
                    this.statusExercises = "success";

                    if (response.data) {
                        response.data.map(exercise => {
                            let savedExercise = this.exercises.find(e => e._id === exercise._id);
                            if (Boolean(savedExercise) === false) {
                                this.exercises.push(exercise);
                            }
                        })
                    }
                },
                error => {
                    this.loading = false;
                    this.statusExercises = "error";
                    console.log(error);
                }
            );
        },
        readExerciseById(id) {
            return this.exercises.find(v => v._id === id) || {};
        }
    },
    computed: {
        
    }
};
</script>

<style scoped>
.card button.card-header {
  font-size: 0.7rem;
  overflow: hidden;
  text-align: left;
}
.card-body {
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