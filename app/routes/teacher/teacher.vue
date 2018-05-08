<template>
<div id="teacher">
    <navbar-for-logged></navbar-for-logged>

    <section class="section">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs col-md-3">
                    <div class="card" v-for="(branch, index) in branches" v-bind:key="index">
                        <button class="card-header btn btn-link" data-toggle="collapse" :href="'#tree-branch-' + index">
                            <div>{{ branch.name }}</div>
                        </button>
                        <div class="card-body collapse" :id="'tree-branch-' + index">
                            <div class="card" v-for="(specialization, index) in branch.specializations" v-bind:key="index">
                                <button class="card-header btn btn-link" data-toggle="collapse" :href="'#tree-specialization-' + index">
                                    <div class="pl-1">{{ specialization.name }}</div>
                                </button>
                                <div class="card-body collapse" :id="'tree-specialization-' + index">
                                    <div class="card" v-for="(typeOfStudy, index) in specialization.typesOfStudy" v-bind:key="index">
                                        <button class="card-header btn btn-link" data-toggle="collapse" :href="'#tree-typeofstudy-' + index">
                                            <div class="pl-2">{{ typeOfStudy.name }}</div>
                                        </button>
                                        <div class="card-body collapse" :id="'tree-typeofstudy-' + index">
                                            <div class="card" v-for="(semester, index) in typeOfStudy.semesters" v-bind:key="index">
                                                <button class="card-header btn btn-link">
                                                    <div class="pl-3">{{ semester.name }}</div>
                                                </button>
                                                <div class="card-body">
                                                    
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
        <ul>
            <li v-for="e in exercisesByClasses" v-bind:key="e._id">{{e.specialization}}</li>
        </ul>
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
    };
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
</style>