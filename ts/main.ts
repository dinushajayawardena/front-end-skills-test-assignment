import $ from 'jquery';

$('#txt-id').trigger('focus');

$('#btn-save').on('click', ()=>{


   const id = $('#txt-id').val() as string;
   const name = $('#txt-name').val() as string;
   const address = $('#txt-address').val() as string;
   let valid = true;

   $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

   if (address.length < 3) {
      $('#txt-address').parent().addClass('invalid');
      $('#txt-address').trigger('select');
      valid = false;
   }

   if (!/[A-Za-z .]{3,}/.test(name)) {

      $('#txt-name').parent().addClass('invalid');
      $('#txt-name').trigger('select');
      valid = false;
   }
   if (!/^C\d{3}$/.test(id.trim())) {
      $('#txt-id').parent().addClass('invalid');
      $('#txt-id').trigger('select');
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
})