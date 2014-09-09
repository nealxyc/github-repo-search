var GitHubApi = require('github'),
    util = require('util'),
    express = require('express'),
    mu = require('mu2');

app = express();

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
});

app.use(express.static("static"));

app.get("/", function(req, resp){
    var query = req.query.query ;
    var page = parseInt(req.query.page || 1);
    if(query){
        console.log("searching for: " + query);
        github.search.repos({
            q: query + " language:js",
            page: page || 1,
        }, function(err, res){
            //console.log("res=" + res);
            if(res.total_count > page * 30){
                res.next_page = req.route.path + "?query=" + query + "&page=" + (page + 1) ;
            }
            if(page > 1){
                res.prev_page = req.route.path + "?query=" + query + "&page=" + (page - 1) ;
            }
            res.showing = (30 * (page - 1) + 1) + "-" + Math.min(res.total_count, (30 * page)) ;
            mu.compileAndRender('index.html', res).pipe(resp);
        });
    }else{
        mu.compileAndRender('index.html', {}).pipe(resp);
    }
    
});

// app.get("/example", function(req, resp){
//     mu.clearCache();
//     mu.compileAndRender('index.html', require('./example.js')).pipe(resp);
    
// });

// Start the server
var server = app.listen(process.env.PORT || 8080, function() {
    console.log(new Date());
    console.log('Listening on port %d', server.address().port);
});