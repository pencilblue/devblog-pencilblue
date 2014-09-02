/**
 * HomePageSettings - Settings for the display of home page content in the Portfolio theme
 *
 * @author Blake Callens <blake@pencilblue.org>
 * @copyright 2014 PencilBlue, LLC.  All Rights Reserved
 */

function HomePageSettings() {}

//dependencies
var PluginService = pb.PluginService;
var Media = require(DOCUMENT_ROOT + '/controllers/admin/content/media.js');

//inheritance
util.inherits(HomePageSettings, pb.BaseController);

HomePageSettings.prototype.render = function(cb) {
    var self = this;

    var content = {
        content_type: "text/html",
        code: 200
    };

    var tabs = [
        {
            active: 'active',
            href: '#home_layout',
            icon: 'home',
            title: self.ls.get('HOME_LAYOUT')
        },
        {
            href: '#media',
            icon: 'picture-o',
            title: self.ls.get('HOME_MEDIA')
        }
    ];

    var pills = [
    {
        name: 'devblog_settings',
        title: self.ls.get('HOME_PAGE_SETTINGS'),
        icon: 'chevron-left',
        href: '/admin/plugins/settings/devblog-pencilblue'
    }];

    var dao  = new pb.DAO();
    dao.query('devblog_theme_settings', {settings_type: 'home_page'}).then(function(homePageSettings) {
        if(homePageSettings.length > 0) {
            homePageSettings = homePageSettings[0];
            homePageSettings.page_media = homePageSettings.page_media.join(',');

            if(!self.session.fieldValues) {
                self.setFormFieldValues(homePageSettings);
            }
        }
        else {
            homePageSettings = {};
        }


        Media.getAll(function(media) {
            var objects = {
                navigation: pb.AdminNavigation.get(self.session, ['plugins', 'manage'], self.ls),
                pills: pills,
                tabs: tabs,
                media: media,
                homePageSettings: homePageSettings
            };
            var angularData = pb.js.getAngularController(objects);

            self.ts.registerLocal('angular_script', angularData);
            self.ts.load('admin/settings/home_page_settings', function(err, result) {
                self.checkForFormRefill(result, function(newResult) {
                    result = newResult;

                    content.content = result;
                    cb(content);
                });
            });
        });
    });
};

HomePageSettings.getRoutes = function(cb) {
    var routes = [
        {
            method: 'get',
            path: '/admin/plugins/settings/devblog-pencilblue/home_page',
            auth_required: true,
            access_level: ACCESS_EDITOR,
            content_type: 'text/html'
        }
    ];
    cb(null, routes);
};

//exports
module.exports = HomePageSettings;
