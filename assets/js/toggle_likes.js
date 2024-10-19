class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click((e) => {
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self.toggler).attr('href'),
            })
            .done(function(data) {
                console.log('data', data); 
                let likesCount = parseInt($(self.toggler).attr('data-likes'));
                console.log("data.data.deleted",data.data.deleted);
                console.log(likesCount);
                if (data.data.deleted === true && likesCount > 0){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }

                $(self.toggler).attr('data-likes', likesCount); 
                $(self.toggler).html(`${likesCount} Likes`);  

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
