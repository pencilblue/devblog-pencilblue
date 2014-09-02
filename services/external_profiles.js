/**
 * ExternalProfilesService - An example of a service that generates random text.
 *
 * @author Brian Hyder <brian@pencilblue.org>
 * @copyright 2014 PencilBlue, LLC.  All Rights Reserved
 */
function ExternalProfilesService() {}

/**
 * This function is called when the service is being setup by the system.  It is
 * responsible for any setup that is needed when first created.  The services
 * are all instantiated at once and are not added to the platform untill all
 * initialization is complete.  Relying on other plugin services in the
 * initialization could result in failure.
 *
 * @param cb A callback that should provide one argument: cb(error) or cb(null)
 * if initialization proceeded successfully.
 */
ExternalProfilesService.init = function(cb) {
    pb.log.debug("ExternalProfilesService: Initialized");
    cb(null, true);
};

/**
 * Returns the profiles that are filled out in plugin settings
 */
ExternalProfilesService.getProfiles = function(cb) {
    var profiles = [];
    var networks = [{
        name: 'github_id',
        displayName: 'Github',
        icon: 'github',
        color: '#829AA8',
        prefix: 'https://github.com/'
    }, {
        name: 'twitter_id',
        displayName: 'Twitter',
        icon: 'twitter',
        color: '#00B0ED',
        prefix: 'https://twitter.com/'
    }, {
        name: 'stack_exchange_id',
        displayName: 'StackExchange',
        icon: 'stack-exchange',
        color: '#195398',
        prefix: 'http://stackexchange.com/users/'
    }, {
        name: 'stack_overflow_id',
        displayName: 'StackOverflow',
        icon: 'stack-overflow',
        color: '#D38B28',
        prefix: 'http://stackoverflow.com/users/'
    }, {
        name: 'linkedin_profile',
        displayName: 'Linkedin',
        icon: 'linkedin',
        color: '#1D87BD',
        prefix: ''
    }, {
        name: 'angellist_id',
        displayName: 'AngelList',
        icon: 'angellist',
        color: '#333333',
        prefix: 'https://angel.co/'
    }, {
        name: 'youtube_channel',
        displayName: 'YouTube',
        icon: 'youtube',
        color: '#D92625',
        prefix: ''
    }];

    pb.plugins.getSettings('devblog-pencilblue', function(err, devblogSettings) {
        for(var i = 0; i < networks.length; i++) {
            for(var j = 0; j < devblogSettings.length; j++) {
                if(devblogSettings[j].name === networks[i].name) {
                    if(devblogSettings[j].value.length) {
                        networks[i].value = devblogSettings[j].value;
                        profiles.push(networks[i]);
                    }
                    break;
                }
            }
        }

        cb(null, profiles);
    });
};

//exports
module.exports = ExternalProfilesService;
