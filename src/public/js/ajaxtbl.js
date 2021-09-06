
$.ajax({
    url:'/user',
    method:'GET',
    dataType:'json',
    data:{'softwareList':softwareList},
    success:function(response){
        if(response.msg=='success'){
            alert('task added successfully');
        }else{
            alert('some error occurred try again');
        }
    },
    error:function(response){
        alert('server error occured')
    }
});