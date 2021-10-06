import $ from 'jquery';

let pageSize = calculatePageSize();
let pages: number = 1;
let selectedPage = 1;

$('#txt-id').trigger('focus');

/* create/ update customer */
$('#btn-save').on('click', (eventData)=>{

   eventData.preventDefault();

   const txtId = $('#txt-id');
   const txtName = $('#txt-name')
   const txtAddress = $('#txt-address');

   const id = (txtId.val() as string).trim();
   const name = (txtName.val() as string).trim();
   const address = (txtAddress.val() as string).trim();
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
   if (!/^C\d{3}$/.test(id)) {
      txtId.parent().addClass('invalid');
      txtId.trigger('select');
      valid = false;
   }
   if (!valid) return;

   if(txtId.attr('disabled')){
      const selectedRow = $('#tbl-customers tbody tr.selected');

      selectedRow.find('td:nth-child(2)').text(txtName.val() as string);
      selectedRow.find('td:nth-child(3)').text(txtAddress.val() as string);
      return;
   }

   if(existCustomer(id)){
      alert("customer already exists");
      txtId.trigger('select');
      return;
   }

   const rowHTML = `
                    <tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${address}</td>
                        <td><div class="trash"></div></td>
                    </tr>
                  `;

   $('#tbl-customers tbody').append(rowHTML);
   showHideTableFooter();
   showHidePagination();

   if(($('#tbl-customers tbody tr').length - 1) % pageSize === 0){
      initPagination();
   }

   navigateToPage(pages === 0 ? 1: pages);

   $('#btn-clear').trigger('click');

});

/* select the correct row */
$('#tbl-customers tbody').on('click', 'tr', function () {

   const txtId = $('#txt-id');
   const txtName = $('#txt-name')
   const txtAddress = $('#txt-address');

   const id = $(this).find('td:first-child').text();
   const name = $(this).find('td:nth-child(2)').text();
   const address = $(this).find('td:nth-child(3)').text();

   txtId.val(id);
   txtId.attr('disabled', "true");
   txtName.val(name);
   txtAddress.val(address);

   $('#tbl-customers tbody tr').removeClass('selected');
   $(this).addClass('selected');
});

/* Delete table row */
$('#tbl-customers tbody').on('click', '.trash', (eventData) => {
      if (confirm('Are you sure to delete?')) {
          $(eventData.target).parents("tr").fadeOut(500, function () {
              $(this).remove();
              showHideTableFooter();
              showHidePagination();
  
              if (($("#tbl-customers tbody tr").length % pageSize) === 0){
                  initPagination();
  
                  if (selectedPage >= pages){
                      selectedPage = pages;
                      navigateToPage(selectedPage);
                  }
              }else{
                  navigateToPage(selectedPage);
              }
  
              $('#btn-clear').trigger('click');
          });
      }
});
  

/* Reset button */
$('#btn-clear').on('click', ()=>{
   $("#tbl-customers tbody tr.selected").removeClass('selected');
   $("#txt-id").removeAttr('disabled').trigger('focus');
});


/* event - window resize */
$(window).on('resize', ()=> {
   pageSize = calculatePageSize();
   initPagination();
   showHidePagination();
   navigateToPage(1);
});

/* function - find duplicates */
function existCustomer(id:string): boolean{

   const ids = $('#tbl-customers tbody tr td:first-child');

   for (let i = 0; i < ids.length; i++) {
      if($(ids[i]).text() === id){
         return true;
      }
   }

   return false;

}

/* Hide Table Footer */
function showHideTableFooter(){
   const  tfoot = $('#tbl-customers tfoot');
   ($('#tbl-customers tbody tr').length > 0) ? tfoot.hide(): tfoot.show();
}

/* Hide Pagination */
function showHidePagination(){
   const nav = $('nav');

   ($('#tbl-customers tbody tr').length > pageSize) ? nav.removeClass('d-none') : nav.addClass('d-none');
}

/* calculate page size */
function calculatePageSize(): number {

   if ($(window).width()! < 992) {
      return 7;
  }

   const tbl = $("#tbl-customers");
   const tFoot = $("#tbl-customers tfoot");

   const rowHtml = `
                     <tr class="dummies">
                        <td>C001</td>
                        <td>Dinusha</td>
                        <td>Gampaha</td>
                        <td><div class="trash"></div></td>
                     </tr>
                     `;

   const nav = $('nav');
   nav.removeClass('d-none');

   const top = $(window).height()! - ($('footer').height()! + nav.outerHeight(true)!);

   nav.addClass('d-none');
   tFoot.hide();

   tbl.find('tbody tr').hide();


   while(true){
      tbl.find('tbody').append(rowHtml);
      const bottom = tbl.outerHeight(true)! + tbl.offset()!.top;

      if(bottom >= top){
         const pageSize = tbl.find('tbody tr.dummies').length - 1;
         
         tbl.find('tbody tr.dummies').remove();

         if(tbl.find('tbody tr').length === 0) tFoot.show();
         return pageSize;
      }
   }

}

/* Initialize pagination */
function initPagination(): void{

   const totalRows = $('#tbl-customers tbody tr').length;
   pages = Math.ceil(totalRows / pageSize);

   let paginationHtml = `
                           <li class="page-item">
                              <a class="page-link" href="#">
                                 <i class="fas fa-backward"></i>
                              </a>
                           </li>`;

   for (let i = 0; i < pages; i++) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
    }

    paginationHtml += `
                        <li class="page-item">
                            <a class="page-link" href="#">
                                <i class="fas fa-forward"></i>
                            </a>
                        </li>
    `;

    $(".pagination").html(paginationHtml);

    $(".page-item:first-child").on('click', function(){
      if ($(this).hasClass("disabled")) return;
      navigateToPage(selectedPage - 1)
  });

  $(".page-item:last-child").on('click', function(){
      if ($(this).hasClass("disabled")) return;
      navigateToPage(selectedPage +1);
  });

  $(".page-item:not(.page-item:first-child, .page-item:last-child)").on('click', function(eventData){
      navigateToPage(+$(this).text());
  } );
   
}


/* move to the correct page */
function navigateToPage(page: number): void{

   if (page <= 0 || page > pages) return;

   selectedPage = page;

   $(".pagination .page-item.active").removeClass('active');

   $(".pagination .page-item").each((index, elm) => {
      if (+$(elm).text() === page){
          $(elm).addClass("active");
          return false;
      }
   });

   $(".pagination .page-item:last-child, .pagination .page-item:first-child").removeClass('disabled');

   if (page === pages) {
      $(".pagination .page-item:last-child").addClass('disabled');
      }else if (page === 1){
         $(".pagination .page-item:first-child").addClass('disabled');
      }

      const rows = $("#tbl-customers tbody tr");
      const start = (page - 1) * pageSize; 
  
      rows.each((index, elm) => {
          if (index >= start && index < (start + pageSize)){
              $(elm).show();
          }else{
              $(elm).hide();
          }
      });

}