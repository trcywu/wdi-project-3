var Pear = Pear || {};

Pear.getToken = function() {
	return window.localStorage.getItem("token");
}

Pear.setToken = function(token) {
	return window.localStorage.setItem("token", token);
}

Pear.removeToken = function() {
  return localStorage.clear();
}

Pear.saveTokenIfPresent = function(data) {
	if (data.token) return this.setToken(data.token);
	return false;
}

Pear.setRequestHeader = function(xhr, settings) {
	var token = Pear.getToken();
	if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
}

Pear.ajaxRequest = function(method, url, data, tpl) {
  console.log(this.APP_URL);
	return $.ajax({
		method: 		method,
		url: 				this.APP_URL + url,
		data: 			data,
		beforeSend: this.setRequestHeader
	}).done(function(data) {
		Pear.saveTokenIfPresent(data);
		if (tpl) return Pear.getTemplate(tpl, data, url)
	}).fail(function(data) {
		// // Not working currently. Will need to be fixed.
		// console.log(data.responseJSON.message);
	});
}

Pear.getUsers = function() {
	return Pear.ajaxRequest("get", "/users");
}

Pear.getTemplate = function(tpl, data){
  var templateUrl = Pear.APP_URL + "/templates/" + tpl + ".html";
  (tpl === "home") ? $("footer").show() : $("footer").hide();
  $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    var parsedTemplate   = _.template(templateData);
    var compiledTemplate = parsedTemplate(data);
    $("main").html(compiledTemplate);
		if ($("#canvas-map").length > 0) Pear.initMap();
		// check for token to display header contents
		Pear.checkLoginState();
  })
}

Pear.linkClick = function(){
  var external = $(this).data("external");
  if (external) return;

  event.preventDefault();
  var url = $(this).attr("href");
  var tpl = $(this).data("template");
  // If there isn't a href, just load the template
  if (url) return Pear.ajaxRequest("get", url, null, tpl)
	return Pear.getTemplate(tpl, null);
}

Pear.formSubmit = function(){
  event.preventDefault();
  var method = $(this).attr("method");
  var url    = $(this).attr("action");
  var tpl    = $(this).data("template");
  var data   = $(this).serialize();
  return Pear.ajaxRequest(method, url, data, tpl);
}

Pear.checkLoginState = function(){
  if (Pear.getToken()) {
    return Pear.loggedInState();
  } else {
    return Pear.loggedOutState();
  }
}

Pear.loggedInState = function(){
	$(".login-btn").hide()
	$(".register-btn").hide()
	$(".logout-btn").show()
}

Pear.loggedOutState = function(){
	$(".login-btn").show()
	$(".register-btn").show()
	$(".logout-btn").hide()
}

Pear.logout = function(){
  event.preventDefault();
  Pear.removeToken();
  return Pear.loggedOutState();
}

Pear.bindLinkClicks = function(){
  // Event delegation
  $("nav").on("click", "a.link", this.linkClick);
  $("main").on("click", "#getUsers", this.getUsers);
	$(".logout-btn").on("click", Pear.logout);
}

Pear.bindFormSubmits = function(){
  // Event delegation
  $("body").on("submit", "form.login", this.hideModal);
  $("body").on("submit", "form.register", this.hideModal);
  $("body").on("submit", "form", this.formSubmit);

}

Pear.hideModal = function(){
  var parents = $(this).parent().parent().parent();
  parents.hide();
  $('.modal-backdrop.in').css('opacity', 0)
  $('.modal-backdrop.fade.in').css({'z-index': -100});
}

Pear.initialize = function(){
  this.setUrl();
  this.bindLinkClicks();
  this.bindFormSubmits();
  this.setSlider();
	this.checkLoginState();
  this.getTemplate("home", null);
};

Pear.setUrl = function(){
  if (window.location.href.indexOf("localhost") >= 0) return this.APP_URL = "http://localhost:3000";
  return this.APP_URL = "https://pearapp.herokuapp.com";
}

$(function(){
	Pear.initialize();
});
