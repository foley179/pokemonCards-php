//----- helper funcs
function compare(a, b, prop) { // a sort function for data to be in ordered alphabetically
  if (a[prop] < b[prop]) {
    return -1;
  }
  if (a[prop] > b[prop]) {
    return 1;
  }
  return 0;
} // TODO: check this is used

function isAllTrue(arr) { // for checking full arr == true
  return arr.every(element => element === true);
}

function clearModal() { // clearing modals
  // console.log("clear modal test"); // test
  
  // reset buttons
  $(".saveButton").attr("aria-disabled", "true");
  $(".saveButton").attr("tab-index", -1);
  $(".saveButton").addClass("disabled");
  
  // clear values
  $("#userModalUsername").val("");

  $("#cardModalName").val("");
  $("#cardModalSerial").val("");
  $("#cardModalHolo").val("none").change();
  $("#cardModalSet").val("");
  $("#cardModalSubset").val("");
  $("#cardModalRarity").val("");
  $("#cardModalImgCode").val("");
  $("#cardModalUser").val("na").change(); // TODO: make sure user select has this default

  // TODO: make sure card and user id are being passed correctly
  $("#cardModalName").attr("data-id", ""); 
  $("#userModalUsername").attr("data-id", "");
  $("#userDupeError").addClass("d-none");

  // clear delete modals data
  $("#deleteConfirmModal").attr("data-id", "");
  $("#deleteConfirmModal").attr("data-type", "");
}

function successPopup(input, message) { // on successful operation
  $("#successMessage").text(message);
  $("#successInput").text(input);
  $(".successPopup").show();
  setTimeout(() => {
    $(".successPopup").fadeOut(1500);
  }, 1500);
}

function createMainTable(view, data) { // create and populate main table
  // clear table

  $("#tableBody").empty();
  $("#tableHead").empty();

  // console.log(`main table test ${view} - ${data[0].cardName}`); // test

  // TODO: disable ability to change user on edit page

  if (view == "cards") {

    for (const row of data) {
      /* returns alphabetically by cardName
      { "id": "20",
        "userId": "20",
        "cardName": "pikachu",
        "serialCode": "111-111",
        "holo": "holo",
        "cardSet": "set1",
        "subset": "sub1",
        "rarity": "rare",
        "imgCode": "" } */

      // TODO: populate this with correct info
      $("#tableBody").append(

        $("<tr>", {

          class: "tr",
          "data-id": row.id,
          "data-imgCode": row.imgCode // TODO: make sure this code is passed into cardModal and img is generated

        }).append([

          $("<td>", {
            text: row.cardName,
            class: "tdCardName"
          }),

          $("<td>", {
            text: row.holo,
            class: "tdHolo"
          }),

          $("<td>", {
            text: row.username,
            class: "tdUsername"
          }),
          
          $("<td>", {
            text: row.cardSet,
            class: "tdSet d-none d-sm-none d-md-table-cell"
          }),
          
          $("<td>", {
            text: row.subset,
            class: "tdSubset d-none d-sm-none d-md-none d-lg-table-cell",
          }),
          
          $("<td>", {
            text: row.serialCode,
            class: "tdSerial d-none d-sm-none d-md-table-cell",
          }),
          
          $("<td>", {
            text: row.rarity,
            class: "tdRarity d-none d-sm-none d-md-none d-lg-table-cell",
          }),

          $("<td>", {
            html: "<button type=\"button\" class=\"btn btn-sm btn-primary fa fa-pen-to-square editButton\"></button>",
            class: "tdEdit"
          }),

          $("<td>", {
            html: "<button type=\"button\" class=\"btn btn-sm btn-danger fa fa-trash-can deleteButton\"></button>",
            class: "tdDelete"
          })

        ])
      )
    }
  } else {
    // if view == user

    for (const row of data) {

      $("#tableBody").append(
    
        $("<tr>", {
          class: "tr",
          "data-id": row.id,
    
        }).append([
    
          $("<td>", {
            text: row.username,
            class: "tdUsername"
          }),
    
          $("<td>", {
            html: "<button type=\"button\" class=\"btn btn-sm btn-primary fa fa-pen-to-square editButton\"></button>",
            class: "tdEdit"
          }),
    
          $("<td>", {
            html: "<button type=\"button\" class=\"btn btn-sm btn-danger fa fa-trash-can deleteButton\"></button>",
            class: "tdDelete"
          })
    
        ])
      )
    }
  }
}

// search function
function search() {
  // TODO: maybe do search by current view?

  let searchTerm = $("#search").val();
  let filter = $("#searchFilter option:selected").val();
  // console.log(`search test: filter - ${filter}, search - ${searchTerm}`); // test

  if (searchTerm != "" || filter != "na") {

    ajaxSearch(filter, searchTerm);

  } else {

    // resets table based on view
    let view = $("#viewSelect option:selected").val();
    // console.log(view); // test
    $("#viewSelect").val(view).change();

  }
}

//----- jquery
$(window).on("load", () => {
  
  // main sites info modal on load
  // $("#infoModal").modal("show"); TODO: uncomment

  // preloader on page load
  if ($("#preloader").length) {
    $("#preloader").delay(3000).fadeOut("slow", () => {
      $(this).remove();
      $("#preloader").removeClass("d-flex");
    })
  }
})

$(() => {
  // on initial load
  ajaxGetAll();
  ajaxPopulateSelect(); // TODO: check this works
})

// general
$("input").on("input", () => {
  // console.log("on any input"); // test
  // used to enable "save" button when a change is made
  $(".saveButton").removeClass("disabled");
  $(".saveButton").removeAttr("aria-disabled");
  $(".saveButton").removeAttr("tab-index");
})

$("input[type=\"text\"]").on("keypress", (e) => {
  // used in tandem with onInput above to stop forms being sent without changes
  // disables "enter" button while in a type=text input, searchbar is excluded as its type=search
  // console.log("on key press test"); // test
  if (e.which == "13") {
    e.preventDefault();
  }
})

$(".modal").on("hidden.bs.modal", () => {
  // disables "select" listener when any modal is closed, used for .saveButton disabling
  // console.log("hide modal test"); // test
  $("select:not(#searchFilter):not(#viewSelect").off("change");
})

// info button
$("#infoButton").on("click", () => {
  $("#infoModal").modal("show");
})

// edit button
$("#tableBody").on("click", ".editButton", function() {

  let view = $("#viewSelect option:selected").val();
  // console.log(view); // test
  $(".saveButton").attr("data-method", "edit");
  $(".modalHeader").text(`Edit ${view}`);
  
  // retrieve row data
  let tr = $(this).closest("tr");
  let id = tr.attr("data-id");
  // console.log(id); // test

  // ajax call will populate modal
  if (view == "users") {

    ajaxGetById(view, id);

  } else if (view == "cards") {

    ajaxGetById(view, id);

  } // TODO: check why this is not one line?

})

// delete button
$("#tableBody").on("click", ".deleteButton", async function() {

  let view = $("#viewSelect option:selected").val();
  // get basic row data
  let tr = $(this).closest("tr");
  let id = tr.attr("data-id");
  $("#deleteConfirmModal").attr("data-id", id);

  if (view == "cards") {

    // get specific row data
    let cardName = tr.find(".tdCardName").text();

    // console.log(cardName); // test
    
    $("#cardModal").modal("hide");
    $("#deleteConfirmOption").text(cardName);
    $("#deleteConfirmModal").modal("show");

  } else if (view == "users") {

    // get specific row data
    let user = tr.find(".tdUsername").text();
    let cardCount = await ajaxDependencyCheck(id);
    
    $("#userModal").modal("hide");
    
    if (cardCount > 0) {

      // console.log("user has dependency"); // test
      // error modal to show dependency warning
      let option = cardCount == 1 ? "" : "s";
      $(".errorDiv").html(`Cannot delete <b>${user}</b>, it has still has ${cardCount} card${option} linked to it.`);
      $("#errorInfo").modal("show");

    } else {

      $("#deleteConfirmOption").text(user);
      $("#deleteConfirmModal").modal("show");

    }
  }
})

// view/add
$("#viewSelect").on("change", () => {
  let view = $("#viewSelect option:selected").val();
  // console.log(view); // test
  
  if (view == "cards") {

    ajaxGetAll();

  } else {
    // if (view == "users")

    ajaxGetAllUsers(); // TODO: change func name from dept

  }
})

$("#addButton").on("click", () => {

  let view = $("#viewSelect option:selected").val();
  // console.log(view); // test
  $(".saveButton").attr("data-method", "add");
  $(".modalHeader").text(`Add ${view}`);
  
  // reset modal
  clearModal();

  if (view == "cards") {

    $("#cardModal").modal("show");

  } else {
    //  if (view == "users")
    // reset modal

    $("#userModalError").addClass("d-none"); // makes sure its hidden
    $("#userModalUsername").val("");
    
    $("#userModal").modal("show");

  }

})

// confirmations
$("#cardConfirmYes").on("click", () => {
  // for add/edit card
  
  $("#cardConfirmModal").modal("hide");
  let method = $(".saveButton").attr("data-method");
  
  if (method === "edit") {
  
    ajaxUpdateCard();
  
  } else {
    // method == "add"
  
    ajaxAddCard();
    
  }
})

$("#cardConfirmNo").on("click", () => {
  // for add card
  $("#cardConfirmModal").modal("hide");
  $("#cardModal").modal("show");
})

$("#userConfirmYes").on("click", () => {
  // for add/edit user
  
  $("#userConfirmModal").modal("hide");

  let method = $(".saveButton").attr("data-method");
  
  if (method === "edit") {
    
    ajaxUpdateUser();
  
  } else {
    // method == "add"
  
    ajaxAddUser();
  
  }
})

$("#userConfirmNo").on("click", () => {
  // for add employee
  $("#userConfirmModal").modal("hide");
  $("#userModal").modal("show");
})

$("#deleteConfirmYes").on("click", () => {
  
  let view = $("#viewSelect option:selected").val();
  let id = $("#deleteConfirmModal").attr("data-id");

  $("#deleteConfirmModal").modal("hide");

  if (view == "users") {
  
    let username = $("#deleteConfirmOption").text();
    ajaxDeleteUserById(id, username);
  
  } else {
    // if view == "cards"
  
    let cardName = $("#cardModalName").val();
    ajaxDeleteCardById(id, cardName);
  
  }
})

$("#deleteConfirmNo").on("click", () => {
  $("#deleteConfirmModal").modal("hide")
})

// save button, used on both options
$(".saveButton").on("click", async (e) => { // add/edit 

  let view = $("#viewSelect option:selected").val();
  let method = $(".saveButton").attr("data-method");
  let option = method == "add" ? "Adding" : "Updating";
  let isDupe = false; // set here once instead of 3 times
  // console.log(`save button view = ${view}, method = ${method}`); // test

  if (view == "users") {
    // check inputs are not empty

    const usernameIsValid = $("#userModalUsername")[0].checkValidity();
    // console.log(usernameIsValid); // test

    if (usernameIsValid) {
  
      if (method == "add") {
        // check if is dupe
        
        let newUser = $("#userModalUsername").val();
        // console.log("test "); // test
        isDupe = await ajaxDupeCheck(newUser);

      }
      // console.log(isDupe); // test

      if (isDupe) {
        
        // show dupe error
        $("#userDupeError").removeClass("d-none");

      } else {

        let username = $("#userModalUsername").val();

        $("#userConfirmOption").text(option);
        $("#userConfirmUsername").text(username);

        // change visible modal to confirmation
        $("#userModal").modal("hide");
        $("#userConfirmModal").modal("show");
        
      }
    }
  } else {
    // if (view == "cards")
    
    // check inputs are not empty
    const userIsValid = $("#cardModalUser")[0].checkValidity();
    const nameIsValid = $("#cardModalName")[0].checkValidity();
    const serialIsValid = $("#cardModalSerial")[0].checkValidity();
    const holoIsValid = $("#cardModalHolo")[0].checkValidity();
    const setIsValid = $("#cardModalSet")[0].checkValidity();
    const subsetIsValid = $("#cardModalSubset")[0].checkValidity();
    const rarityIsValid = $("#cardModalRarity")[0].checkValidity();

    let isAllValid = isAllTrue([userIsValid, nameIsValid, serialIsValid, holoIsValid, setIsValid, subsetIsValid, rarityIsValid]);

    if (isAllValid) {
      
      let newUser = $("#cardModalUser option:selected").text();
      let newCardName = $("#cardModalName").val();
      let newSerial = $("#cardModalSerial").val();
      let newHolo = $("#cardModalHolo").val();
      let newSet = $("#cardModalSet").val();
      let newSubset = $("#cardModalSubset").val();
      let newRarity = $("#cardModalRarity").val();
      let newImgCode = $("#cardModalImgCode").val();
        
      // populate cardConfirmModal
      $("#cardConfirmOption").text(option);
      $("#cardConfirmUser").text(newUser);
      $("#cardConfirmName").text(newCardName);
      $("#cardConfirmSerial").text(newSerial);
      $("#cardConfirmHolo").text(newHolo);
      $("#cardConfirmSet").text(newSet);
      $("#cardConfirmSubset").text(newSubset);
      $("#cardConfirmRarity").text(newRarity);
      $("#cardConfirmImgCode").text(newImgCode);
      
      // change visible modal to confirmation
      $("#cardModal").modal("hide");
      $("#cardConfirmModal").modal("show");

    }
      
  }
})

// search listeners
$("#search").on("input", () => {
  search();
})

$("#search, #searchFilter").on("focus", () => {
  // sets to cards when trying to search or filter
  if ($("#viewSelect option:selected").val() != "cards") {
    $("#viewSelect").val("cards").change();
  }

})

$("#searchFilter").on("change", () => {

  let filter = $("#searchFilter option:selected").val();
  // doesn't try to search while filters are being populated
  if (filter) {
    search();
  }

})

//----- ajax
function ajaxPopulateSelect() { // populate user select

  $.ajax({
    url: "php/getAllUsers.php", // TODO: check this works then delete populateSelect.php
    type: "POST",
    dataType: "json",
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data); // test

        // reset selects
        $("#cardModalUser").empty();

        // set a disabled default option
        $("#cardModalUser").append(
          $("<option>", {
            value: "",
            disabled: true,
            text: "",
            selected: true
          })
        );

        // show default
        $("#cardModalUser").val("na").change();

        for (const user of result.data) {
          // getting one of each loc and dept for options below
          
          $("#cardModalUser").append(
            $("<option>", {
              value: user.id,
              text: user.username
            })
          )

        }
        
      } else {
        // if status = error

        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");

      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxGetAll() { // populate table with card data
  $("#search").val("");
  
  $.ajax({
    url: "php/getAll.php",
    type: "POST",
    dataType: "json",
    success: (result) => {

      if (result.status.name == "ok") {

        // console.log(result.data); // test

        createMainTable("cards", result.data);

      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxGetAllUsers() { // populate table with user data
  $("#search").val("");

  $.ajax({
    url: "php/getAllUsers.php", // TODO: change file
    type: "POST",
    dataType: "json",
    success: (result) => {
      // console.log(result.data[0])

      if (result.status.name == "ok") {
        
        createMainTable("users", result.data);

      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxAddCard() { // add card

  let userId = $("#cardModalUser option:selected").val();
  let cardName = $("#cardModalName").val();
  let serialCode = $("#cardModalSerial").val();
  let holo = $("#cardModalHolo").val();
  let cardSet = $("#cardModalSet").val();
  let subset = $("#cardModalSubset").val();
  let rarity = $("#cardModalRarity").val();
  let imageCode = $("#cardModalImgCode").val();
  // console.log([userId, cardName, serial, holo, cardSet, subset, rarity, imageCode]); // test

  $.ajax({
    url: "php/insertCard.php", // TODO: change file
    type: "POST",
    dataType: "json",
    data: {userId, cardName, serialCode, holo, cardSet, subset, rarity, imageCode},
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data); // test

        // re-call getAllDepts and populateSelects to update page
        ajaxGetAll();
        
        successPopup(cardName, "successfully added.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxAddUser() { // add user

  let username = $("#userModalUsername").val();
  // console.log(username); // test

  $.ajax({
    url: "php/insertUser.php",
    type: "POST",
    dataType: "json",
    data: {username},
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data); // test

        // re-call getAllUsers to update table and re-populate userselect
        ajaxGetAllUsers();
        ajaxPopulateSelect();

        successPopup(username, "successfully added.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxDeleteCardById(cardId, cardName) { // delete card by id

  // console.log([cardId, card]); // test

  $.ajax({
    url: "php/deleteCardByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: cardId
    },
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(`card ${cardId} deleted`); // test

        // re-call getAll to update page
        ajaxGetAll();

        successPopup(cardName, "successfully removed.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxDeleteUserById(userId, user) { // delete user by id

  // console.log([userId, user]); // test

  $.ajax({
    url: "php/deleteUserByID.php", // TODO: change file
    type: "POST",
    dataType: "json",
    data: {
      id: userId
    },
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(`emp ${empId} deleted`); // test

        // re-call getAllUsers and populateSelect to update table
        ajaxGetAllUsers();
        ajaxPopulateSelect();

        successPopup(user, "successfully removed.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxUpdateUser() { // update user by id

  let userId = $("#userModalUsername").attr("data-id");
  let username = $("#userModalUsername").val();

  // console.log([userId, username]); // test

  $.ajax({
    url: "php/updateUserByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: userId,
      username: username
    },
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(`user ${userId} updated`); // test

        // re-call getAllUsers and populateSelect to update table
        ajaxGetAllUsers();
        ajaxPopulateSelect();

        successPopup(username, "successfully updated.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxUpdateCard() { // update card by id

  // user not passed on update as it can't be changed
  let id = $("#cardModalName").attr("data-id");
  let cardName = $("#cardModalName").val();
  let serialCode = $("#cardModalSerial").val();
  let holo = $("#cardModalHolo").val();
  let cardSet = $("#cardModalSet").val();
  let subset = $("#cardModalSubset").val();
  let rarity = $("#cardModalRarity").val();
  let imgCode = $("#cardModalImgCode").val();

  // console.log([id, cardName, serialCode, holo, cardSet, subset, rarity, imgCode]); // test

  $.ajax({
    url: "php/updateCardByID.php",
    type: "POST",
    dataType: "json",
    data: {id, cardName, serialCode, holo, cardSet, subset, rarity, imgCode},
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(`card ${id} updated`); // test

        // re-call getAll to update page
        ajaxGetAll();

        successPopup(cardName, "successfully updated.");
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

async function ajaxDupeCheck(text) { // check for duplicates
  let isDupe = false;
  // console.log(`dupe check: ${text}`); // test

  await $.ajax({
    url: "php/dupeCheck.php",
    type: "POST",
    dataType: "json",
    data: {text},
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data.length); // test

        if (result.data.length > 0) {
          isDupe = true;
        }
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });

  return isDupe;
}

async function ajaxDependencyCheck(id) { // check for dependencies
  let hasDependency = 0;
  // console.log(`dependency check: ${id}`); // test

  await $.ajax({
    url: "php/dependencyCheck.php",
    type: "POST",
    dataType: "json",
    data: {id},
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data[0].dCount); // test
        let count = parseInt(result.data[0].dCount)

        if (count > 0) {
          hasDependency = count;
        }
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });

  return hasDependency;
}

function ajaxSearch(filter, searchTerm) {
  // console.log([filter, searchTerm]); // test

  $.ajax({
    url: "php/search.php",
    type: "POST",
    dataType: "json",
    data: {
      searchTerm,
      filter
    },
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data); // test

        createMainTable("cards", result.data);
        
      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

function ajaxGetById(view, id) { // get card/user by id
  // console.log([view, id]); // test
  
  $.ajax({
    url: "php/getByID.php",
    type: "POST",
    dataType: "json",
    data: {
      type: view, 
      id: id
    },
    success: (result) => {

      if (result.status.name == "ok") {
        
        // console.log(result.data); // test

        clearModal();
        let data = result.data[0];

        if (view == "users") {
          // console.log(id); // test
        
          let username = data.username;
          
          // attach id to "lastName" input for edit
          $("#userModalUsername").attr("data-id", id);
        
          // populate modal before showing
          $("#userModalUsername").val(username);
        
          $("#userModal").modal("show");
        
        } else {
          // if (view == "cards")

          let cardId = data.id;
          let cardName = data.cardName;
          let userId = data.userId;
          let serial = data.serialCode;
          let holo = data.holo;
          let cardSet = data.cardSet;
          let subset = data.subset;
          let rarity = data.rarity;
          let imgCode = data.imgCode;
          
          // console.log(cardName); // test
          
          // attach id to cardName for edit
          $("#cardModalName").attr("data-id", cardId);

          // populate modal before showing
          $("#cardModalName").val(cardName);
          $("#cardModalUser").val(userId).change();
          $("#cardModalSerial").val(serial);
          $("#cardModalHolo").val(holo);
          $("#cardModalSet").val(cardSet);
          $("#cardModalSubset").val(subset);
          $("#cardModalRarity").val(rarity);
          $("#cardModalImgCode").val(imgCode);

          $("#cardModal").modal("show");
          
        }

      } else {
        // if status = error
        $(".errorDiv").html(`An error occured, please try again.<br>${result.status.description}`);
        $("#errorInfo").modal("show");
      }
    },
    error: (error) => {
      console.log(error.responseText);
    }

  });
}

/*
dupeCheck and dependencyCheck have to be async/await as a result is returned from it.
TODO: create login system
*/