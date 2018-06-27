<template>
<div id="upload-exercise" class="d-inline-block">
  <div id="uploadReportModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Dodaj sprawozdanie</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning" v-if="loading">
            <img src="/assets/loader.svg" />
            Trwa dodawanie, poczekaj jeszcze chwilę.
          </div>
          <div class="alert alert-success" v-if="status === 'success'">
            Sprawozdanie zostało dodane pomyślnie.
          </div>
          <div class="alert alert-danger" v-else-if="status === 'error'">
            Coś poszło nie tak.
          </div>
          <form v-on:submit.prevent="onSubmit">
            <div class="form-group">
              <label for="attachmentOfExercise">Sprawozdanie</label>
              <input type="file" class="form-control-file" id="attachmentOfExercise" v-on:change="processFile($event)">
            </div>
            <hr />
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
/** 
 * @namespace components/uploadReport 
 * */
export default {
  props: {
    exercise: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      report: {
        attachment: null
      },

      status: null,
      loading: false
    };
  },

  methods: {
    processFile: function(event) {
      this.report.attachment = event.target.files[0];
    },
    onSubmit: function() {
      if (Boolean(this.exercise) === false) return;
      let fd = new FormData();

      fd.append("exercise", this.exercise._id);
      fd.append("attachment", this.report.attachment);

      this.loading = true;

      axios.post("http://localhost:9000/report", fd).then(
        response => {
          this.loading = false;
          this.status = "success";
          console.log(response.data);
        },
        error => {
          this.loading = false;
          this.status = "error";
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 16px;
  margin-top: -2px;
}
</style>
