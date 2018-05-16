<template>
    <div class="modal fade" id="reasonReject" tabinex="-1" role="dialog" >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
                <h5 class="modal-title">Powód odrzucenia sprawozdania</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                   </button>
         </div>
         <div class="modal-body">
             <form v-on:submit >
                 <div class="form-group">
                     <label for="reasonRejectE">Powód odrzucenia sprawozdania</label>
                     <input type="text" class="form-control" id="reasonRejectE" pleaceholder="np. Brak wniosków" v-model="">
                 </div>
                 <hr />
                 <button type="submit" class="btn btn-primary">Zapisz</button>
                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>
             </form>
         </div>
      </div><!--end class="modal-content-->
    </div> <!--end div class="modal-dialog" role="document"-->
</div> <!--end class="modal fade" id="reasonReject"-->
</template>
