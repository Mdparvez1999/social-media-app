import { replaceInFile } from 'replace-in-file'

const options = {
	files: 'dist/**/*.js',
	from: /(?<=import\s.*?['"])(\..*?)(?=['"])/g,
	to: '$1.js',
};


try {
	await replaceInFile(options)
}
catch (error) {
	console.error('Error occurred:', error)
}
