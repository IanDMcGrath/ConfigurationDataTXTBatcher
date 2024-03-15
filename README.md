# DISCUSSION
This script was created to reduce large SQL output files into smaller batches for PCMI to digest.
- Original operational target
```
\\pmpwarehouse\E$\Temp\230312
```
---
# USAGE
- Add the large file to the input directory at ./input/
- Open the script file: app.js
- Change the user parameters: 
```
// USER DEFINED PARAMETERS
minRowCountPerBatch   - The estimated rowcount before adjusting for maintained rows
inputFileName         - Name of the file to input
outputFileName        - Desired output filename
columnNumberToMonitor - The column to maintain when the current batchs row count exceeds minRowCountPerBatch
columnDelimiter       - The character delimiter between columns. i.e. comma (',') or pipe ('|')
```
- run this command in the terminal:
```
node app.js
```
- retrieve result from the output folder: ./output/
---
# INPUT FORMAT
- Header
- Body
- Trailing empty 
```
TPA Code|Date From|Rate Book|Vehicle Type|Coverage Code|Component Name|LossCode Code|Hide VIN Surcharges|Class|Term Months|Term Miles|Number of Occurrences|Aggregate Coverage Limit|Aggregate Parts Limit|Total Per Claim Limit|Limit Per Part|Parts Limit Per Occurrence|Price Visible|Menu Display Option|Base Admin|Consignment Kit|PG Surcharge - Express or Thin|House Portion of 50% Commission Split|PermaPlate Admin Fee|Base Reserve - APP|Additional Reserve - APP|CLIP - APP|Premium Tax - APP|Risk Fee - APP|Reinsurance Reserve - APP|Reinsurance Additional Reserve - APP|Retro Reserve - APP|Retro Additional Reserve - APP|DOWC Held Reserve - APP|PermaPlate Internal Reserve - APP|Goodwill - APP|Late Registration Fee - APP|Lithia Penetration Management Fee|Washington Obligor Fee - APP|Agent Commission|Employee/House Split Commissions|Servicing Employee Commissions|Regional Override|Management Fee|Dealer Overremit/Dealer Rebate|Incentive|Incentive 2|Incentive 3|Suggested Retail
PERM|2016-02-01|50HR100AP|*|ARVI3K-P,N_STRV3K/NEW|RV AWNING|STRV-36_N|

```
---
# DEPENDENCIES
- node v16.17.0