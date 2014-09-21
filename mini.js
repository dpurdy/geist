	var fs = require('fs');
	var md = require('markdown');
	var rss = require('rss');
	var less = require('less');
	var repl = require("repl");
	var http = require('http');
	var path = require('path');
	var url = require('url');
	var querystring = require('querystring');
	var request = require('request');

	//todo handle http://localhost:8080/favicon.ico

	function asPath(root, name, type)
	{
		if(type) { name += type; }
		return path.resolve(root, name);
	}

	function log(message)
	{
		console.log("[" + new Date().toISOString() + "]: " + message + '\n');
	}

	function asString(resource, callback)
	{

		console.log("Reading " + resource);

		fs.readFile(resource, 'utf-8', function (e, data) {

			var type = path.extname(resource);

			switch(type)
			{
			 	case '.md':

					callback(null, md.markdown.toHTML(data));

					break;

				case '.less':

					less.render(data, function(e, css)
					{
						callback(e, css);
					});

					break;

				default:

					callback(e, data);
				}
			});
		}

	var root = "./doc/";

	http.createServer(function (req, res)
	{
	
		log('Start request for http://' + req.headers.host + req.url);

		try
		{
			req.url = 'readme';

				asString(asPath(root, 'template.html'), function(e, template)
				{
					asString(asPath(root, req.url, '.less'), function (e, style)
					{
						template = template.replace('<!--style-->', style);

						asString(asPath(root, 'header.html'), function(e, header)
						{
							template = template.replace('<!--header-->', header);

							asString(asPath(root, req.url, '.md'), function(e, markdown)
							{
								template = template.replace('<!--entity-->', markdown);

								asString(asPath(root, 'footer.html'), function(e, footer)
								{
									template = template.replace('<!--footer-->', footer);

									res.writeHead(200, {'Content-Type': 'text/html'});

									res.end(template);

								});
							});
						});
					});
				});
			}
		
		catch(e)
		{
			log('error for http://' + req.headers.host + req.url + e.stack);
			res.writeHead(500);
			res.end();
		}

	}).listen(80);
