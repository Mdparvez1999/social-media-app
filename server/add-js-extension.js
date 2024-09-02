import { replaceInFile } from 'replace-in-file'

const options = {
	files: 'server/dist/**/*.js',
	from: /(?<=import\s.*?['"])(\..*?)(?=['"])/g,
	to: '$1.js',
};


try {
	const results = await replaceInFile(options)
	console.log('Replacement results:', results)
}
catch (error) {
	console.error('Error occurred:', error)
}
