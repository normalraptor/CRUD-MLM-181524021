$(document).ready(function(){
    $('.delete-entry').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete Entry ?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result) {
                    console.log('Deleting Entry...');
                    window.location.href='/';
                },
                error: function(err) {
                    console.log(err); 
                }
            });
        }
    });

    $('.edit-entry').on('click', function(){
        $('#edit-form-title').val($(this).data('title'));
        $('#edit-form-content').val($(this).data('content'));
        $('#edit-form-id').val($(this).data('id'));
    })
});