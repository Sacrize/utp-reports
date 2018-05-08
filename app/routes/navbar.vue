<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="http://www.utp.edu.pl">UTP</a>
        <span class="navbar-text">
            
        </span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <slot name="right-menu"></slot>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
  props: {
    
  },
  data: function() {
    return {
      
    };
  }
};
</script>

<style lang="css">

</style>
