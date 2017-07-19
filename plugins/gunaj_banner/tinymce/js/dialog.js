var MoodleGUnajBannerDialog = {

    init : function() {
    },

    insert : function(title,description,leftidentifier,leftnumber) {

        var left = '';
        if ( leftidentifier && leftidentifier.length >= 0){
             var leftnumbertext = '';
            if ( leftnumber && leftnumber.length >= 0)
                leftnumbertext = '<span class="left_number">'+leftnumber+'</span>';
            //Builds left
            left = '<div class="banner_left" >'+'<span class="left_identifier">'+leftidentifier+'</span>'+leftnumbertext+'</div>';
            
        }
        var addClass = "";
        //No tengo parte izquierda
        if (left.length == 0){
            addClass = " onlyRight";
        }
    	var right = '<div class="banner_right">'+'<span class="right_title">'+title+'</span>'+'<span class="right_identifiedescriptionr">'+description+'</span>'+'</div>';
        var gunaj_banner = '<div class="gunaj_banner '+addClass+'">'+left+right+'</div><p><br/></p>';

        tinyMCEPopup.editor.execCommand('mceInsertContent', false, gunaj_banner);
        tinyMCEPopup.close();
        return;
    },

};

tinyMCEPopup.onInit.add(MoodleGUnajBannerDialog.init, MoodleGUnajBannerDialog);