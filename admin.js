var firebaseConfig = {
    apiKey: "AIzaSyClwYtwK0OH96cCKCis8T8KWFL9u8lJfH8",
    authDomain: "uncbootcampproject1.firebaseapp.com",
    databaseURL: "https://uncbootcampproject1.firebaseio.com",
    projectId: "uncbootcampproject1",
    storageBucket: "uncbootcampproject1.appspot.com",
    messagingSenderId: "1007244888274"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var app = {
  personalityProfile: {},
}
var userSnap;
var userSnapKeys;
var snapJson;
var getData = function() {
    userSnapKeys = Object.keys(userSnap);
    console.log("userSnapKeys", userSnapKeys);
    var j=1;
    for(var i = 0; i<userSnapKeys.length || j<16; i++) {
        var tempRef = userSnapKeys[i];
        var tempPerson = userSnap[tempRef];
        console.log(tempPerson);
        if(tempPerson===undefined) {
            break;
        } else if(tempPerson.hasOwnProperty('jsonObj')) {
            console.log('has json', i);
            var tempID = returnedData['person' + j];
            console.log('tempPerson', tempPerson);
            console.log('tempPersonName', tempPerson['name']);
            console.log('person' + j);
            returnedData['person' + j]['name'] = tempPerson['name'];
            returnedData['person' + j]['jsonString'] = tempPerson['jsonObj'];
            var jS = returnedData['person' + j].jsonString;
            console.log(jS);
            returnedData['person' + j]['jsonObj'] = JSON.parse(jS);
            jsonObj = returnedData['person' + j]['jsonObj'];
            $('.person' + j).text(tempPerson['name']);
            for (var k = 0; k<5; k++) {
                console.log(jsonObj.personality[k].name);
                for(var l=0; l<6; l++) {     
                    returnedData['person' + j]['percentile'].push(jsonObj.personality[k].children[l].percentile);
                  }
            }
            for (var k = 0; k<12; k++) {
                returnedData['person' + j]['percentile'].push(jsonObj.needs[k].percentile);
            }
            for (var k = 0; k <5; k++) {
                returnedData['person' + j]['percentile'].push(jsonObj.values[k].percentile);
            }
            j++;

        }
               
    }
    callChart();
}

$(document).ready(function(){   
  authorization.showModal();
  $('#submitUser').on("click", function(event) {
    event.preventDefault();
    authorization.establishedUser();      
    authorization.signIn(authorization.userEmail, authorization.userPassword);
  });
  $("#errorButton").on("click", function() {
    $("#error").html(authorization.errorMessage);
    authorization.showModal();
  });
  $(".person1, .person4, .person5, .person6, .person7, .person8, .person9, .person10, .person11, .person12, .person13, .person14, .person15, .person3, .person2").on("click", function(){
    var target = $(event.target).attr("class");
    console.log(target);

    var targetName = returnedData[target]['name'];
    var targetNumber = returnedData[target].percentile;
    $("td.column" + $(this).closest("div").children("button").attr("data-array")).removeClass("hidden");
    $(event.target).closest("div").children("button").html(targetName + " ").append($("<span class='caret'>"));
    $("td.column" + $(this).closest("div").children("button").attr("data-array")).each(function(i,cell){
        $(cell).text(Math.round(targetNumber[i] * 100) + " %");
    })
    $(this).closest("th").next("th").removeClass("hidden");
  })
  $(".hideme").on("click", function(){
    $("td.column" + $(this).closest("div").children("button").attr("data-array")).addClass("hidden");
    $(event.target).closest("div").children("button").html("Select a Profile" + " ").append($("<span class='caret'>"));
    $("td.column" + $(this).closest("div").children("button").attr("data-array")).each(function(i,cell){
        $(cell).text(""); 
    })
    $(this).closest("th").addClass("hidden");
  })
  // $(".person15").on("click", function(){
  //   $("td.column" + $(this).closest("div").children("button").attr("data-array")).removeClass("hidden");
  //   $(event.target).closest("div").children("button").html("Your Results!" + " ").append($("<span class='caret'>"));
  //   $("td.column" + $(this).closest("div").children("button").attr("data-array")).each(function(i,cell){
  //       $(cell).text(Math.round(returnedData.percentileArray[i] * 100) + " %");   
  //   })
  //   $(this).closest("th").next("th").removeClass("hidden");
  // })
  $("#insert0").on("click", function(){
      $("td").removeClass("hidden");
      $("th").removeClass("hidden");
  });
});

var authorization = {
    userEmail: "",
    userPassword: "",
    errorMessage: undefined,
    errorCode: undefined,
    loggedIn: false,
    hideModal: function() {
    $("#signInModal").modal('hide');
    },
    showModal: function() {
    if(!authorization.loggedIn) {
     $('#signInModal').modal('show');
    }
    },
    showError: function() {
    $('#errorModal').modal('show');
    },  
    errorModal: function() {
    $("#error").html(authorization.errorMessage);
    $("#errorModal").modal('show');
    console.log(authorization.errorMessage);
    },
    signUp : function (email, password) {
    console.log("signUp fired");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(authorization.makeNewProfile, function(error) {
        authorization.errorCode = error.code;     
        authorization.errorMessage = error.message;
        authorization.errorModal(); 
    });
    },
    signIn: function(email,password) {
    console.log("signIn fired");  
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
      authorization.hideModal;
      authorization.loggedIn = true;
      var temp = authorization.userEmail.replace("@","AT").replace(".","dot");
      console.log(temp);
      userRef = database.ref("/users/" + temp);
      userRef.once("value", function (snapshot) {
        if(snapshot.val().hasOwnProperty('adminKey')) {
            if(snapshot.val()['adminKey'] === 'alpha') {
                authorization.userName =snapshot.val().name;
                authorization.userEmail = snapshot.val().email;
                $("#name").text(authorization.newUserName);
                database.ref('/users').once('value', function(snap) {
                    userSnap = snap.val();
                    console.log(userSnap);
                    getData();
                })
                
            }
        }
        // if(Object.keys(snapshot.val()['jsonObj']).indexOf('needs') !== -1) {
        //   console.log(Object.keys(snapshot.val()['jsonObj']).indexOf('needs') !== -1);
        //   $('#main').addClass('hidden');
        //   $('#tabbable-area').removeClass('hidden');
        //   returnedData.renderSunburst(app.personalityProfile);
        //   returnedData.getPercentages(app.personalityProfile);
        // }
      })
      }, function(error) {
         authorization.errorCode = error.code;     
         authorization.errorMessage = error.message;
         authorization.errorModal();  
    })      
  },  
    establishedUser : function() {
    authorization.userEmail = $("#userEmail").val().trim();
    console.log(authorization.userEmail);
    authorization.userPassword = $("#userPassword").val().trim();
    console.log(authorization.userPassword);
    authorization.loggedIn = true;
    },
        
}


var returnedData = {
  person1: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person2: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person3 : {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person4: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person5: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person6: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person7: {
    name: "",
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person8: {
    name:"",
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person9: {
    name:"",
    percentile:[],
    jsonString: "",
    jsonObj: {},
  },
  person10:{
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {}, 
  },
  person11: {
    name: '',
    percentile:[],
    jsonString: "",
    jsonObj: {},
  },
  person12: {
    name: '',
    percentile: [],
    jsonString: "",
    jsonObj: {},
  },
  person13: {
    name: '',
    percentile:[],
    jsonString: "",
    jsonObj: {},
  },
  person14: {
    name: '',
    percentile:[],
    jsonString: "",
    jsonObj: {},
  },
  person15: {name:'',
    percentile:[],
    jsonString: "",
    jsonObj: {},
  },
  newText: "",
  percentileArray:[],
  getPercentages: function(jsonObj) {
    for (var i = 0; i<5; i++) {
        console.log(jsonObj.personality[i].name);
        for(var j=0; j<6; j++) {     
        returnedData.percentileArray.push(jsonObj.personality[i].children[j].percentile);
      }
    }
    for (var i = 0; i<12; i++) {
        returnedData.percentileArray.push(jsonObj.needs[i].percentile);
    }
    for (var i = 0; i <5; i++) {
        returnedData.percentileArray.push(jsonObj.values[i].percentile);
    }
  },
//   renderSunburst : () => {
//     $.getJSON('./profiles/en_v3.json', '', function ( profile ) {
//       $('#profile').append('<pre>' + JSON.stringify(profile, null, 2) + '</pre>');
//       var chart = new PersonalitySunburstChart({'selector':'#sunburstChart', 'version': 'v3'});
//       chart.show(profile, './profile_photo.jpg');
//     });
//   }
}
var callChart = function() {
var labels = [
      "Adventurousness", "Artistic_Interests", "Emotionality", "Imagination", "Intellect", "Authority_Challenging", "Achievement_Striving", "Cautiousness", "Dutifulness", "Orderliness", "Self_Discipline", "Self_Efficacy", "Activity_Level", "Assertiveness", "Cheerfulness", "Excitement_Seeking", "Outgoing", "Gregariousness", "Altruism", "Cooperation", "Modesty", "Uncompromising", "Sympathy", "Trust", "Fiery", "Prone_to_Worry", "Melancholy", "Immoderation", "Self_Consciousness", "Susceptible_to_Stress", "Challenge", "Closeness", "Curiosity", "Excitement", "Harmony", "Ideal", "Liberty", "Love", "Practicality", "Self_Expression", "Stability", "Structure", "Values_Conservation", "Openness_to_Change", "Hedonism", "Self_Enhancement", "Self_Transcendence"
      ];

    var hasFillCommon = [
        // {label: "Your Results!",
        // data: returnedData.percentileArray,
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // borderColor: 'rgba(0,0,0,1)',
        // borderWidth: 1
        // },
        {label: returnedData.person1.name,
        data: returnedData.person1.percentile,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1
        },
        {label: returnedData.person2.name,
        data: returnedData.person2.percentile,
        backgroundColor:'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
        },
        {label: returnedData.person3.name,
        data: returnedData.person3.percentile,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
        },
        {label: returnedData.person4.name,
        data: returnedData.person4.percentile,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
        },
        {label: returnedData.person5.name,
        data: returnedData.person5.percentile,
        backgroundColor:'rgba(153, 102, 255, 0.2)',
        borderColor:'rgba(153, 102, 255, 1)',
        borderWidth: 1
        },
        {label: returnedData.person6.name,
        data: returnedData.person6.percentile,
        backgroundColor:'rgba(255, 159, 64, 0.2)',
        borderColor:'rgba(255, 159, 64, 1)',
        borderWidth: 1
        },
        {label: returnedData.person7.name,
        data: returnedData.person7.percentile,
        backgroundColor:'rgba(50, 204, 86, 0.2)',
        borderColor:'rgba(50, 204, 86, 1)',
        borderWidth: 1
        },
    ]

    var hasFillPolarize = [
        // {label: "Your Results!",
        // data: returnedData.percentileArray,
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // borderColor: 'rgba(0,0,0,1)',
        // borderWidth: 1
        // },
        {label: returnedData.person8.name,
        data: returnedData.person8.percentile,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1
        },
        {label: returnedData.person9.name,
        data: returnedData.person9.percentile,
        backgroundColor:'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
        },
        {label: returnedData.person10.name,
        data: returnedData.person10.percentile,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
        },
        {label: returnedData.person11.name,
        data: returnedData.person11.percentile,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
        },
        {label: returnedData.person12.name,
        data: returnedData.person12.percentile,
        backgroundColor:'rgba(153, 102, 255, 0.2)',
        borderColor:'rgba(153, 102, 255, 1)',
        borderWidth: 1
        },
        {label: returnedData.person13.name,
        data: returnedData.person13.percentile,
        backgroundColor:'rgba(255, 159, 64, 0.2)',
        borderColor:'rgba(255, 159, 64, 1)',
        borderWidth: 1
        },
        {label: returnedData.person14.name,
        data: returnedData.person14.percentile,
        backgroundColor:'rgba(50,204,86, 0.2)',
        borderColor:'rgba(50,204,86, 1)',
        borderWidth: 1
        },
    ]
    var noFillCommon = [
        // {label: "Your Results!",
        // data: returnedData.percentileArray,
        // backgroundColor: 'rgba(0, 0, 0, 1)',
        // borderColor: 'rgba(0,0,0,1)',
        // pointBackgroundColor: 'rgba(0, 0, 0, 1)',
        // pointBorderColor: 'rgba(0,0,0,1)',
        // borderWidth: 1,
        // fill: false,
        // },
        {label: returnedData.person1.name,
        data: returnedData.person1.percentile,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person2.name,
        data: returnedData.person2.percentile,
        backgroundColor:'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor:'rgba(54, 162, 235, 1)',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person3.name,
        data: returnedData.person3.percentile,
        backgroundColor: 'rgba(255, 206, 86, 1)',
        borderColor: 'rgba(255, 206, 86, 1)',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        pointBorderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person4.name,
        data: returnedData.person4.percentile,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person5.name,
        data: returnedData.person5.percentile,
        backgroundColor:'rgba(153, 102, 255, 1)',
        borderColor:'rgba(153, 102, 255, 1)',
        pointBackgroundColor:'rgba(153, 102, 255, 1)',
        pointBorderColor:'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person6.name,
        data: returnedData.person6.percentile,
        backgroundColor:'rgba(255, 159, 64, 1)',
        borderColor:'rgba(255, 159, 64, 1)',
        pointBackgroundColor:'rgba(255, 159, 64, 1)',
        pointBorderColor:'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person7.name,
        data: returnedData.person7.percentile,
        backgroundColor:'rgba(50,204,86, 1)',
        borderColor:'rgba(50,204,86, 1)',
        pointBackgroundColor:'rgba(50,204,86, 1)',
        pointBorderColor:'rgba(50,204,86, 1)',
        borderWidth: 1,
        fill: false,
        },
    ]

    var noFillPolarize = [
        {label: "Your Results!",
        data: returnedData.percentileArray,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderColor: 'rgba(0,0,0,1)',
        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
        pointBorderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person8.name,
        data: returnedData.person8.percentile,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person9.name,
        data: returnedData.person9.percentile,
        backgroundColor:'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor:'rgba(54, 162, 235, 1)',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person10.name,
        data: returnedData.person10.percentile,
        backgroundColor: 'rgba(255, 206, 86, 1)',
        borderColor: 'rgba(255, 206, 86, 1)',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
        pointBorderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person11.name,
        data: returnedData.person11.percentile,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person12.name,
        data: returnedData.person12.percentile,
        backgroundColor:'rgba(153, 102, 255, 1)',
        borderColor:'rgba(153, 102, 255, 1)',
        pointBackgroundColor:'rgba(153, 102, 255, 1)',
        pointBorderColor:'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person13.name,
        data: returnedData.person13.percentile,
        backgroundColor:'rgba(255, 159, 64, 1)',
        borderColor:'rgba(255, 159, 64, 1)',
        pointBackgroundColor:'rgba(255, 159, 64, 1)',
        pointBorderColor:'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        fill: false,
        },
        {label: returnedData.person14.name,
        data: returnedData.person14.percentile,
        backgroundColor:'rgba(50,204,86, 1)',
        borderColor:'rgba(50,204,86, 1)',
        pointBackgroundColor:'rgba(50,204,86, 1)',
        pointBorderColor:'rgba(50,204,86, 1)',
        borderWidth: 1,
        fill: false,
        },
    ]

    var ctx1 = $("#myChart1");
    var myChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: hasFillCommon,
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Personality Measurement'
                    },
                    ticks: {
                        autoSkip: false
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Bar Chart'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
            }
        }
    });

    var ctx1v2 = $("#myChart1v2");
    var myChart1v2 = new Chart(ctx1v2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: hasFillPolarize,
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Personality Measurement'
                    },
                    ticks: {
                        autoSkip: false
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Bar Chartv2'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
            }
        }
    });

    var ctx2 = $("#myChart2");
    var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: noFillCommon,
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Personality Measurement'
                    },
                    ticks: {
                        autoSkip: false
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Line Chart'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
            }
        }

    })

    var ctx2v2 = $("#myChart2v2");
    var myChart2v2 = new Chart(ctx2v2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: noFillPolarize,
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Personality Measurement'
                    },
                    ticks: {
                        autoSkip: false
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage'
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Line Chartv2'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
            }
        }

    })

    var ctx3 = $("#myChart3");
    var myChart3 = new Chart(ctx3, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: noFillCommon,
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Radar Chart'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: true,
            }
        }
    });

    var ctx3v2 = $("#myChart3v2");
    var myChart3v2 = new Chart(ctx3v2, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: noFillPolarize,
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Comparative Radar Chartv2'
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: true,
            }
        }
    });
}