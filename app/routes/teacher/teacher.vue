<template>
<div id="teacher">
    <navbar-for-logged></navbar-for-logged>

    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-xs col-md-4">
                    <div class="card" v-for="(branch, index1) in branches" v-bind:key="index1">
                        <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}`">
                            <div>{{ branch.name }}</div>
                        </button>
                        <div class="card-body collapse" :id="`tree-${index1}`">
                            <div class="card" v-for="(specialization, index2) in branch.specializations" v-bind:key="index2">
                                <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}-${index2}`">
                                    <div class="pl-1">{{ specialization.name }}</div>
                                </button>
                                <div class="card-body collapse" :id="`tree-${index1}-${index2}`">
                                    <div class="card" v-for="(typeOfStudy, index3) in specialization.typesOfStudy" v-bind:key="index3">
                                        <button class="card-header btn btn-link" data-toggle="collapse" :href="`#tree-${index1}-${index2}-${index3}`">
                                            <div class="pl-2">{{ typeOfStudy.name }}</div>
                                        </button>
                                        <div class="card-body collapse" :id="`tree-${index1}-${index2}-${index3}`">
                                            <div class="card" v-for="(semester, index4) in typeOfStudy.semesters" v-bind:key="index4">
                                                <button class="card-header btn btn-link" v-on:click.prevent="getExercises(semester.exercises)" data-toggle="collapse" :href="`#tree-${index1}-${index2}-${index3}-${index4}`">
                                                    <div class="pl-3">{{ semester.name }}</div>
                                                </button>
                                                <div class="card-body collapse" :id="`tree-${index1}-${index2}-${index3}-${index4}`">
                                                    <div class="card card-body" v-for="exercise in exercises" v-bind:key="exercise._id">
                                                        {{ exercise.name }}
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
      title: "",
      exercisesByClasses: Array(),
      branches: Array(),
      exercises: Array(),
      loading: false,
    };
  },
  methods: {
        getExercises(ids) {
            this.loading = true;
            axios.post("http://localhost:9000/exercises", { ids }).then(
                response => {
                    this.loading = false;
                    this.statusExercises = "success";

                    if (response.data.exercises) {
                        this.exercises = response.data.exercises;
                    } else {
                        this.exercises = [];
                    }
                },
                error => {
                    this.loading = false;
                    this.statusExercises = "error";
                    console.log(error);
                }
            );
        },
    },
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
</style>