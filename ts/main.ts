import $ from 'jquery';

$('#txt-id').trigger('focus');

$('#btn-save').on('click', ()=>{

   const txtId = $('#txt-id');
   const txtName = $('#txt-name')
   const txtAddress = $('#txt-address');

   const id = txtId.val() as string;
   const name = txtName.val() as string;
   const address = txtAddress.val() as string;
   let valid = true;

   $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

   if (address.length < 3) {
      txtAddress.parent().addClass('invalid');
      txtAddress.trigger('select');
      valid = false;
   }

   if (!/[A-Za-z .]{3,}/.test(name)) {

      txtName.parent().addClass('invalid');
      txtName.trigger('select');
      valid = false;
   }
   if (!/^C\d{3}$/.test(id.trim())) {
      txtId.parent().addClass('invalid');
      txtId.trigger('select');
      valid = false;
   }

   if (!valid) return;

   let rowHTML = `
                    <tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${address}</td>
                        <td><div class="trash"></div></td>
                    </tr>
                  `;

   $('#tbl-customers tbody').append(rowHTML);

   const trash = $('.trash');

   trash.off('click');
   trash.on('click', (eventData)=>{
      if(confirm('Are you sure to delete the customer ')){
         $(eventData.target).parents('tr').fadeOut(500, function (){
            $(this).remove();
            showHideTableFooter();
         });
      }
   });

   showHideTableFooter()
});

function showHideTableFooter(){
   const  tfoot = $('#tbl-customers tfoot');
   ($('#tbl-customers tbody tr').length > 0) ? tfoot.hide(): tfoot.show();
}

