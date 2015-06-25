module.exports = function IndexModule(pb) {
    
  /**
   * Index - The home page controller of the portfolio theme.
   *
   * @author Blake Callens <blake@pencilblue.org>
   * @copyright 2014 PencilBlue, LLC.  All Rights Reserved
   */
  function Index() {}

    //dependencies
    var util = pb.util;
    var config = pb.config;
    var PluginService = pb.PluginService;
    var TopMenu = pb.TopMenuService;
    var Comments = pb.CommentService;
    var ArticleService = pb.ArticleService;
    var externalProfiles = PluginService.getService('external_profiles', 'devblog-pencilblue');
    var pluginService = new PluginService();

    //inheritance
    util.inherits(Index, pb.BaseController);

    /**
     * This is the function that will be called by the system's RequestHandler.  It
     * will map the incoming route to the ones below and then instantiate this
     * prototype.  The request handler will then proceed to call this function.
     * Its callback should contain everything needed in order to provide a response.
     *
     * @param cb The callback.  It does not require a an error parameter.  All
     * errors should be handled by the controller and format the appropriate
     *  response.  The system will attempt to catch any catastrophic errors but
     *  makes no guarantees.
     */
    Index.prototype.render = function(cb) {
      var self = this;

      var content = {
          content_type: "text/html",
          code: 200
      };

      TopMenu.getTopMenu(self.session, self.localizationService, function(themeSettings, navigationObject, accountButtonsObject) {
          TopMenu.getBootstrapNav(navigationObject, accountButtonsObject, function(navigation, accountButtons) {
              pluginService.getSettings('devblog-pencilblue', function(err, devblogSettings) {
                  var homePageKeywords = '';
                  var homePageDescription = '';
                  for(var i = 0; i < devblogSettings.length; i++) {
                      switch(devblogSettings[i].name) {
                          case 'home_page_keywords':
                              homePageKeywords = devblogSettings[i].value;
                              break;
                          case 'home_page_description':
                              homePageDescription = devblogSettings[i].value;
                              break;
                          default:
                              break;
                      }
                  }

                  var dao = new pb.DAO();
                  dao.q('devblog_theme_settings', {where: {settings_type: 'home_page'}}, function(err, homePageSettings) {
                      if(homePageSettings.length > 0) {
                          homePageSettings = homePageSettings[0];
                      }
                      else {
                          homePageSettings = self.getDefaultHomepageSettings();
                      }

                      externalProfiles.getProfiles(function(err, profiles) {
                          self.ts.registerLocal('meta_keywords', homePageKeywords);
                          self.ts.registerLocal('meta_desc', homePageDescription);
                          self.ts.registerLocal('meta_title', pb.config.siteName);
                          self.ts.registerLocal('meta_lang', config.localization.defaultLocale);
                          self.ts.registerLocal('current_url', self.req.url);
                          self.ts.registerLocal('navigation', new pb.TemplateValue(navigation, false));
                          self.ts.registerLocal('account_buttons', new pb.TemplateValue(accountButtons, false));
                          self.ts.registerLocal('hero_header', homePageSettings.hero_header);
                          self.ts.registerLocal('hero_copy', homePageSettings.hero_copy);
                          self.ts.registerLocal('home_page_content', new pb.TemplateValue(homePageSettings.page_layout, false));

                          var angularObjects = pb.ClientJs.getAngularObjects({
                              navigation: navigationObject,
                              accountButtons: accountButtonsObject,
                              profiles: profiles,
                              heroImage: homePageSettings.home_page_hero
                          });
                          self.ts.registerLocal('angular_objects', new pb.TemplateValue(angularObjects, false));

                          self.ts.load('landing_page', function(err, template) {
                              if(util.isError(err)) {
                                  content.content = '';
                              }
                              else {
                                  content.content = template;
                              }

                              cb(content);
                          });
                      });
                  });
              });
          });
      });
  };

  Index.prototype.getDefaultHomepageSettings = function() {
      return { show_hero: '1',
          home_page_hero: '//i.imgur.com/MLnm6V9.jpg',
          hero_header: 'This is a header',
          hero_copy: 'This is copy',
          page_media: [],
          page_layout: 'This is the main content'
      };
  };

  /**
  * Provides the routes that are to be handled by an instance of this prototype.
  * The route provides a definition of path, permissions, authentication, and
  * expected content type.
  * Method is optional
  * Path is required
  * Permissions are optional
  * Access levels are optional
  * Content type is optional
  *
  * @param cb A callback of the form: cb(error, array of objects)
  */
  Index.getRoutes = function(cb) {
      var routes = [
          {
              method: 'get',
              path: '/',
              auth_required: false,
              content_type: 'text/html'
          }
      ];
      cb(null, routes);
  };

  //exports
  return Index;
}
