/*!
 * Automate user flair template entries for Reddit
 * Christopher Parsons <cwlparsons@gmail.com>
 */

// Configuration
var timeout = 500,
    flairs = [],
    logos = [
        { text: '', css: 'Logo1'},
        { text: '', css: 'Logo2'},
        { text: '', css: 'Logo3'}
    ],
    teams = [
        { text: '', css: 'laa'},
        { text: '', css: 'hou-2'},
        { text: '', css: 'ari-2'},
        { text: '', css: 'atl'},
        { text: '', css: 'mil'},
        { text: '', css: 'pit'},
        { text: '', css: 'stl'},
        { text: '', css: 'col'},
        { text: '', css: 'chc'},
        { text: '', css: 'lad-2'},
        { text: '', css: 'kc'},
        { text: '', css: 'mia'},
        { text: '', css: 'sea'},
        { text: '', css: 'min'},
        { text: '', css: 'det'},
        { text: '', css: 'was-1'},
        { text: '', css: 'nym'},
        { text: '', css: 'nyy'},
        { text: '', css: 'oak'},
        { text: '', css: 'bal-2'},
        { text: '', css: 'sd-1'},
        { text: '', css: 'phi'},
        { text: '', css: 'cin'},
        { text: '', css: 'bos'},
        { text: '', css: 'sf-1'},
        { text: '', css: 'tb'},
        { text: '', css: 'tex'},
        { text: '', css: 'tor-2'},
        { text: '', css: 'cle-1'},
        { text: '', css: 'cws'}
    ];

// Build flair list
flairs = flairs.concat(logos);

// Add numbers from 0 - 100
for (var i = 0; i < 101; i++) {
    flairs.push({ text: '', css: i.toString() });
}

flairs = flairs.concat(teams);

// Main function
(function($, timeout, flairs) {

    // Repeat setFlair
    function setFlair(i) {
        // Find last form entry
        var entry = $('#tabbedpane-templates form.flair-entry').last();

        // Add the flair text
        if (flairs[i].text) {
            entry.find('input[name="text"]').val(flairs[i].text);
        }

        // Add the flair CSS class
        if (flairs[i].css) {
            entry.find('input[name="css_class"]').val(flairs[i].css);
        }

        // If a flair has either text or CSS, submit the entry
        if (flairs[i].css || flairs[i].text) {
            entry.submit();
        }       

        // If there are more flairs, continue through the array
        if (i < flairs.length - 1) {
            // Delay to allow the submission and template to renew
            setTimeout(function() {
                setFlair(i + 1);
            }, timeout);
        }
    }

    // Run the script
    setFlair(0);

})(jQuery, timeout, flairs);