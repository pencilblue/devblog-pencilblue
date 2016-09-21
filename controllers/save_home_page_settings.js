'use strict';

module.exports = function SaveHomePageSettingsModule(pb) {

    //dependencies
    var util = pb.util;

    /**
     * Saves settings for the display of home page content in the Portfolio theme
     * @class SaveHomePageSettings
     * @constructor
     */
    function SaveHomePageSettings() {}
    util.inherits(SaveHomePageSettings, pb.BaseController);

    /**
     * @method render
     * @param {function} cb
     */
    SaveHomePageSettings.prototype.render = function(cb) {
      var self = this;

      this.getJSONPostParams(function(err, post) {
          delete post._id;

          var opts = {
              where: {settings_type: 'home_page'}
          };
          var dao = new pb.DAO();
          dao.q('devblog_theme_settings', opts, function(err, homePageSettings) {
              if (util.isError(err)) {
                  return self.reqHandler.serveError(err);
              }
              if(homePageSettings.length > 0) {
                  homePageSettings = homePageSettings[0];
                  pb.DocumentCreator.update(post, homePageSettings);
              }
              else {
                  homePageSettings = pb.DocumentCreator.create('devblog_theme_settings', post);
                  homePageSettings.settings_type = 'home_page';
              }

              dao.save(homePageSettings, function(err, result) {
                  if(util.isError(err))  {
                      cb({
                          code: 500,
                          content: pb.BaseController.apiResponse(pb.BaseController.API_FAILURE, self.ls.g('generic.ERROR_SAVING'), result)
                      });
                      return;
                  }

                  cb({content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, self.ls.g('HOME_PAGE_SETTINGS') + ' ' + self.ls.g('admin.SAVED'))});
              });
          });
      });
    };

    SaveHomePageSettings.prototype.getSanitizationRules = function() {
      return {
          page_layout: pb.BaseController.getContentSanitizationRules()
      };
    };

    SaveHomePageSettings.getRoutes = function(cb) {
      var routes = [
          {
              method: 'post',
              path: '/actions/admin/plugins/settings/portfolio/home_page',
              auth_required: true,
              access_level: pb.SecurityService.ACCESS_EDITOR,
              content_type: 'text/html'
          }
      ];
      cb(null, routes);
    };

  //exports
  return SaveHomePageSettings;
};
