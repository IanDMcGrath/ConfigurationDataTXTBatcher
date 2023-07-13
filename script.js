

/**
 * This script reads in a user-defined file, then writes out numbered batches based on a user-defined rowcount, slicing the batch on a monitored column.
 * At time of writing, this was created to break apart Loss Codes Import - AP.txt from a 250mb filesize, slizing between ratebooks such that the ending ratebook in one batch is not the starting ratebook in the next batch
 * 
 */

// USER DEFINED PARAMETERS
const minRowCountPerBatch = 90000; // 90,000
const inputFileName = 'Loss Codes Import - BUND.txt'; // The name of the input file including extension; i.e. fileName.txt
const outputFileName = 'Loss Codes Import - BUND'; // The basename of the output file; the end resulting output is concatenated as <outputFileName>_<batchNumber>.txt; Note that .txt will be automatically assigned by the script.
const columnNumberToMonitor = 3; // The column to maintain; Originally split on ratebooks column so a ratebook would not appear in two separate batches. The column value is 1-indexed (not 0-indexed)
const columnDelimiter = '|'; // The column delimiter.

/** use this list to know exactly which file a particular ratebook is assigned */
const spotlist = new Set([
  //  '50ON103AP'
  // ,'50ME107AP'
  // ,'50AH115AP'
]);

const spotted = new Set();

const fs = require('fs');
const readline = require('readline');

async function largeFileIntoBatch() {
  const fileStream = await fs.createReadStream('input/'+inputFileName,'utf-8');

  const rl = await readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
	
  // iterate over each line
  let i = 0;
	let batchOutput = 'output/';
	let batchName = outputFileName;
	let batchNumber = 1;
	let watchvalue = '';
	let currentwatch = '';
	await fs.truncate(batchOutput+batchName+'_'+batchNumber+'.txt', 0,()=>{console.log('Truncated file: '+batchOutput+batchName+'_'+batchNumber+'.txt')});
	let writer = fs.createWriteStream(batchOutput+batchName+'_'+batchNumber+'.txt','utf-8');
	console.log('new batch: '+batchOutput+batchName+'_'+batchNumber+'.txt');
	let header = '';
  for await (const line of rl) {
		i++;
		/**
		 * output should snip at end of current ratebook
		 */
		
		let trySpot = line.split(columnDelimiter,columnNumberToMonitor)[columnNumberToMonitor-1];
		if (spotlist.has(trySpot)) {
			spotted.add(batchNumber);
		}
		
		if (i === 1 && batchNumber === 1) {
			header = line;
			await writer.write(header+'\n','utf-8');
			continue;
		}
		if (i % minRowCountPerBatch === 0) {
			watchvalue = line.split(columnDelimiter,columnNumberToMonitor)[columnNumberToMonitor-1];
		}
		if(watchvalue.length >= 10) console.log('Warning RATEBOOK is over 9 characters in length:'+watchvalue);
		
		if (i > minRowCountPerBatch) {
			currentwatch = line.split(columnDelimiter,columnNumberToMonitor)[columnNumberToMonitor-1];
			if (watchvalue !== currentwatch) {
				watchvalue = currentwatch;
				i = 0;
				batchNumber++;
				console.log('new batch: '+batchOutput+batchName+'_'+batchNumber+'.txt');
				await fs.truncate(batchOutput+batchName+'_'+batchNumber+'.txt', 0,()=>{console.log('Truncated file: '+batchOutput+batchName+'_'+batchNumber+'.txt')});
				writer = await fs.createWriteStream(batchOutput+batchName+'_'+batchNumber+'.txt','utf-8');
				await writer.write(header+'\n','utf-8');
			}
		}
		
		await writer.write(line+'\n','utf-8');
  }
	console.log(spotted);
}

largeFileIntoBatch();
