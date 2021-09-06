module.exports = function(models) {
  "use strict";
  this.mainController = new (require('./main_controller'))(models);

  this.formController = new (require('./form_controller'))(models);

  this.formsubmitController = new (require('./form-submit_controller'))(models);

  this.infoController = new (require('./info_controller'))(models);

  this.userController = new (require('./user_controller'))(models);

  this.detailsController = new (require('./details_controller'))(models);

  this.editController = new (require('./edit_controller'))(models);

  this.dbController = new (require('./db_controller'))(models);

  this.pdfController = new (require('./pdf_controller'))(models);
};
