//Constants declaration to change html text dynamically
const descNoResults= 'Try starting a new search below';
const descResults= 'Look at the result below to see the details of the person you’re searched for.';

/* 
    Function that is executed by pressing the GO button.
    This function validates if the user email is correct or not and redirect
    to the landing results page, sending the email by the url
*/
$("#btnUserSearch").click(function(){
    email= $("#txtUserEmail").val();
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if(email.match(pattern)){
        $(".invalid-email-box").hide();
        $("#txtUserEmail").removeClass("invalid-email-input");

        location.href = `landing-results.html?email=${email}`;
    }else{
        $(".invalid-email-box").show();
        $("#txtUserEmail").addClass("invalid-email-input");
    }
});

/* 
    Function that is executed on the document.ready() event of the landing results page
    This function gets the email from the url and makes the AJAX petition to the
    provided API. With the obtained data, it prints the user information with template literals.
*/
function userSearch(){
    email= location.search.split('email=')[1];
    $.ajax({
        url: `https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${email}`,
        cache: false,
        contentType: false,
        processData: false,
        method: 'GET',
        type: 'GET',
        success: function(data){
            $(".spinner-div").hide();

            if(Object.keys(data).length === 0){
                $("#number-results").text("0 Results");
                $("#results-desc").text(descNoResults);
                $(".results-container-user").css("padding-top", "15em");
                $(".results-container-user").css("padding-bottom", "15em");
            }else{
                $("#number-results").text("1 Result");
                $("#results-desc").text(descResults);
                
                $("#info-displayed").append(`
                    <h3>${data.first_name} ${data.last_name}, 35</h3>
                    <p>${data.description}</p>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4>Address</h4>
                            <p>${data.address}</p>

                            <h4>Email</h4>
                            <p>${data.email}</p>
                        </div>
                        <div class="col-lg-6 col-md-6">
                            <h4>Phone Numbers</h4>
                            <div class="phone-numbers-list">
                                ${Object.keys(data.phone_numbers).map(function (key) {
                                    return "<p>" + data.phone_numbers[key] + "</p>"           
                                }).join("")}
                            </div>
                            

                            <h4>Relatives</h4>
                            ${Object.keys(data.relatives).map(function (key) {
                                return "<p>" + data.relatives[key] + "</p>"           
                            }).join("")}
                        </div>
                    </div>
                `);

                $(".user-information").show();

            }

            $(".results-container-user").show();
            $(".search-container-results").show();
            
        }
    });
}