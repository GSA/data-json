
if (typeof GSA === "undefined") {
    var GSA = GSA || {};
}

GSA.dataDotJSON = {
    init: function() {
        GSA.dataDotJSON.display();
    },
    display: function() {
        $.getJSON('/data.json', function(data) {

            var themes = [];
            //get all themes as array
            for (var i = 0; i < data.length; i++) {
                if ($.inArray(data[i].theme[0], themes) === -1) {
                    themes.push(data[i].theme[0]);
                }
            }

            //sort array alpha
            themes = themes.sort(function(a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            //move 'other' to end
            var other_index = themes.indexOf('Other');
            themes.move(other_index, themes.length - 1);



            var byTheme = {};

            var output = '<ul>'

            for (var i = 0; i < themes.length; i++) {
                //nested theme objects
                byTheme[themes[i]] = [];
                //table of contents
                output += GSA.dataDotJSON.templates.contents_entry
                    .replace(/\{\{theme\}\}/g, themes[i]);
            };

            output += '</ul><br>'

            //populate
            for (var i = 0; i < data.length; i++) {
                byTheme[data[i].theme[0]].push(data[i]);
            }

            for (var i = 0; i < themes.length; i++) {
                //theme header html from template
                output += GSA.dataDotJSON.templates.theme
                    .replace(/\{\{theme\}\}/g, themes[i]);
                //alpha sort nested objects
                var sorted = byTheme[themes[i]].sort(function(a, b) {
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                });

                //no need to sort actual byTheme object, let's head straight to the output.
                //byTheme[themes[i]] = sorted;

                //entry html from template
                for (var j = 0; j < sorted.length; j++) {
                    output += GSA.dataDotJSON.templates.entry
                        .replace('{{title}}', sorted[j].title)
                        .replace('{{description}}', sorted[j].description)
                        .replace('{{accessURL}}', sorted[j].accessURL);
                };
            }
            //append
            $('.dataContainer').append(output);
        });
    },
    templates: {
        entry: '<div class="entry"><h4><a href="{{accessURL}}" target"_blank">{{title}}</a></h4><p>{{description}}</p><br></div>',
        theme: '<h3 id="theme-{{theme}}">{{theme}}</h3><hr>',
        staging: '<strong>[Note: This data is dynamic, and not available in the Staging environment. It can be viewed in Production: <a href="http://gsa.gov/portal/content/181595">http://gsa.gov/portal/content/181595</a>.]</strong><br><br>',
        'contents_entry': '<li><a href="#theme-{{theme}}">{{theme}}</a></li>'
    }
};

GSA.dataDotJSON.init();

//ASSETS
//move item in array
Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
//INDEXOF POLYFILL, BECAUSE IE8 DOESN'T KNOW HOW TO COUNT
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}
