<template>
<div class="modal fade" id="createExerciseModal" tabindex="-1" role="dialog">
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
          <img src="/assets/loader.svg" /> Trwa dodawanie, poczekaj jeszcze chwilę.
        </div>
        <div class="alert alert-success" v-else-if="status === 'success'">
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
            <input type="file" class="form-control-file" id="attachmentOfExercise" v-on:change="processFile($event)">
          </div>
          <hr />
          <div class="card">
            <button type="button" class="card-header" data-toggle="collapse" href="#classCollapse">
              Wybierz kogo ma dotyczyć to ćwiczenie.
            </button>
            <div class="card-body collapse" id="classCollapse">
              <div class="form-group">
                <label>Wydział</label>
                <select class="form-control" v-on:click="getBranches" v-model="exercise.branch">
                  <option v-for="branch in branches" v-bind:key="branch" v-bind:value="branch">
                    {{ branch }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-show="exercise.branch">
                <label>Kierunek</label>
                <select class="form-control" v-on:click="getSpecializations" v-model="exercise.specialization">
                  <option v-for="specialization in specializations" v-bind:key="specialization" v-bind:value="specialization">
                    {{ specialization }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-show="exercise.specialization">
                <label>Rodzaj studiów</label>
                <select class="form-control" v-on:click="getTypesOfStudy" v-model="exercise.typeOfStudy">
                  <option v-for="typeOfStudy in typesOfStudy" v-bind:key="typeOfStudy" v-bind:value="typeOfStudy">
                    {{ typeOfStudy }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-show="exercise.typeOfStudy">
                <label>Semestr</label>
                <select class="form-control" v-on:click="getSemesters" v-model="exercise.semester">
                  <option v-for="semester in semesters" v-bind:key="semester" v-bind:value="semester">
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
/** 
 * @namespace components/createExercise 
 * */

export default {
  props: {},
    /** 
     * @memberof components/createExercise
     * @param {object} exercise Obiekt tworzonego ćwiczenia
     * @param {string[]} branches Lista wydziałów UTP
     * @param {string[]} specializations Lista kierunków dla wydziału
     * @param {string[]} typesOfStudy Lista typów dzienne/zaoczne dla kierunku
     * @param {string[]} semesters Lista semestrów dla typu
     * @param {string} status Rezultat ostatniego ajaxa success/error
     * @param {boolean} loading W trakcie pobierania danych ajaxem lub nie
     */
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
    /**
     * Handler do zapisu załącznika z formularza do obiektu ćwiczenia
     * 
     * @memberof components/createExercise
     * @param {object} event Event obj
     * @func processFile
     */
    processFile(event) {
      this.exercise.attachment = event.target.files[0];
    },
    /**
     * Wysyłka nowego ćwiczenia do zapisu na serwer
     * 
     * @memberof components/createExercise
     * @body {string} name Nazwa ćwiczenia
     * @body {string} description Opis
     * @body {file} attachment Załącznik, np. zip z materiałami
     * @body {string} branch Wydział UTP
     * @body {string} specialization Kierunek
     * @body {string} typeOfStudy Typ dzienne/zaoczne
     * @body {string} semester Semestr
     * @func onSubmit
     */
    onSubmit() {
      let fd = new FormData();

      fd.append("name", this.exercise.name);
      fd.append("description", this.exercise.description);
      fd.append("attachment", this.exercise.attachment);
      fd.append("branch", this.exercise.branch);
      fd.append("specialization", this.exercise.specialization);
      fd.append("typeOfStudy", this.exercise.typeOfStudy);
      fd.append("semester", this.exercise.semester);

      this.loading = true;

      axios.post("http://localhost:9000/exercise", fd).then(
        response => {
          this.loading = false;
          this.status = "success";
          this.resetForm();
        },
        error => {
          this.loading = false;
          this.status = "error";
        }
      );
    },
    resetForm() {
      this.exercise = {};
      this.$el.getElementsByTagName("form")[0].reset();
    },
    getBranches() {
      axios.get("http://localhost:9000/school/branches").then(
        response => {
          this.branches = response.data || Array();
          this.exercise.specialization = null;
          this.exercise.typeOfStudy = null;
          this.exercise.semester = null;
        },
        error => {
          console.log(error);
        }
      );
    },
    getSpecializations() {
      axios
        .get("http://localhost:9000/school/specializations", {
          params: { branch: this.exercise.branch }
        })
        .then(
          response => {
            this.specializations = response.data || Array();
            this.exercise.typeOfStudy = null;
            this.exercise.semester = null;
          },
          error => {
            console.log(error);
          }
        );
    },
    getTypesOfStudy() {
      axios
        .get("http://localhost:9000/school/typesofstudy", {
          params: {
            branch: this.exercise.branch,
            specialization: this.exercise.specialization
          }
        })
        .then(
          response => {
            this.typesOfStudy = response.data || Array();
            this.exercise.semester = null;
          },
          error => {
            console.log(error);
          }
        );
    },
    getSemesters() {
      axios
        .get("http://localhost:9000/school/semesters", {
          params: {
            branch: this.exercise.branch,
            specialization: this.exercise.specialization,
            typesOfStudy: this.exercise.typeOfStudy
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
img {
  width: 16px;
  margin-top: -2px;
}
</style>
