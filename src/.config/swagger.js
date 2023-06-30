const swaggerOption = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Twitter bot',
			version: '1.0.0',
			description: 'Cервис автоматического сбора информационных материалов из социальной сети микроблогов «Twitter»',
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT}`,
			},
		],
	},
	apis: ['./routes/*.js'],
};

module.exports = swaggerOption