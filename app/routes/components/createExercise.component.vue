<template>
    <div class="modal fade" id="createExerciseModal" tabindex="-1" role="dialog" >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Dodaj ćwiczenie</h5>
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
                        <hr />
                        <div class="card">
                            <button class="card-header" data-toggle="collapse" href="#classCollapse">
                                Wybierz kogo ma dotyczyć to ćwiczenie.
                            </button>
                            <div class="card-body collapse" id="classCollapse">
                                <div class="form-group">
                                    <label>Wydział</label>
                                    <select class="form-control" v-on:click="getBranches" v-model="exercise.branch">
                                        <option v-for="branch in branches" v-bind:key="branch" v-bind:value="branch" >
                                            {{ branch }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group" v-show="exercise.branch">
                                    <label>Kierunek</label>
                                    <select class="form-control" v-on:click="getSpecializations" v-model="exercise.specialization">
                                        <option v-for="specialization in specializations" v-bind:key="specialization" v-bind:value="specialization" >
                                            {{ specialization }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group" v-show="exercise.specialization">
                                    <label>Rodzaj studiów</label>
                                    <select class="form-control" v-on:click="getTypesOfStudy" v-model="exercise.typeOfStudy">
                                        <option v-for="typeOfStudy in typesOfStudy" v-bind:key="typeOfStudy" v-bind:value="typeOfStudy" >
                                            {{ typeOfStudy }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group" v-show="exercise.typeOfStudy">
                                    <label>Semestr</label>
                                    <select class="form-control" v-on:click="getSemesters" v-model="exercise.semester">
                                        <option v-for="semester in semesters" v-bind:key="semester" v-bind:value="semester" >
                                            {{ semester }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <button type="submit" class="btn btn-primary">Zapisz</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    classes: {
      type: Array,
      required: false,
      default: Array()
    }
  },
  data: function() {
    return {
      exercise: {},
      branches: Array(),
      specializations: Array(),
      typesOfStudy: Array(),
      semesters: Array(),
      status: null,
      loading: false
    };
  },
  methods: {
    getBranches() {
      axios.get("http://localhost:9000/school/branches").then(
        response => {
          this.branches = response.data || Array();
        },
        error => {
          console.log(error);
        }
      );
    },
    getSpecializations() {
      axios.get("http://localhost:9000/school/specializations", {
          params: { branch: this.exercise.branch }
      })
      .then(
        response => {
          this.specializations = response.data || Array();
        },
        error => {
          console.log(error);
        }
      );
    },
    getTypesOfStudy() {
      axios.get("http://localhost:9000/school/typesofstudy", {
          params: { 
            branch: this.exercise.branch,
            specialization: this.exercise.specialization,
          }
      })
      .then(
        response => {
          this.typesOfStudy = response.data || Array();
        },
        error => {
          console.log(error);
        }
      );
    },
    getSemesters() {
      axios.get("http://localhost:9000/school/semesters", {
          params: { 
            branch: this.exercise.branch,
            specialization: this.exercise.specialization,
            typesOfStudy: this.exercise.typeOfStudy,
          }
      })
      .then(
        response => {
          this.semesters = response.data || Array();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
</script>

<style lang="css" scoped>
button.card-header {
  text-align: left;
}
</style>
