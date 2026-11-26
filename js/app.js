var W='<div class="warn"><b>Heads up:</b> ';
var A=[
{id:'ebs',t:'Module 3-2: Multiple EBS volumes',pts:15,due:'Nov 29',
 goal:'Launch a small cloud computer (EC2), attach extra storage drives (EBS), and prove they work. Think of EBS volumes as extra USB hard drives plugged into a rented computer. Ubuntu or Amazon Linux earns 5 extra-credit points.',
 shots:['(Required) Output of df -h or lsblk showing all your drives and mount points. Name: ebs-drives.png','(Required) Output of the test_file commands. Name: ebs-testfile.png'],
 steps:[
 {t:'Launch the EC2 instance',what:'Create a virtual server using Amazon Linux or Ubuntu (extra credit) with a Free Tier type.',why:'The extra drives need a computer to attach to.',where:'AWS Console > EC2 > Launch instance',
  how:['Name it ebs-lab.','Pick Amazon Linux or Ubuntu AMI marked Free Tier.','Instance type: the one marked Free Tier eligible.','Create a new key pair, download the file and keep it safe (it is like your house key, never share it).','Network settings: allow SSH. The assignment says source 0.0.0.0/0.','Root volume 8 GB, leave other settings default. Click Launch.'],
  warn:'SSH from 0.0.0.0/0 means anyone on the internet can try to log in. Class requirement only; terminate the instance when finished.',
  exp:'Instance shows state Running.',fix:'Launch failed with limit error: check the Region (top right) and try again.',done:'I have a running EC2 instance.'},
 {t:'Create and attach extra EBS volumes',what:'Make 1 or more new volumes and attach them to the instance.',why:'The assignment asks for "various EBS" volumes.',where:'EC2 > Elastic Block Store > Volumes',
  how:['Click Create volume, size e.g. 1 GB.','IMPORTANT: choose the same Availability Zone as your instance (shown on the instance details).','Create, then Actions > Attach volume, pick your instance.','Repeat for each extra volume.'],
  exp:'Volumes show state in-use.',fix:'Instance not listed when attaching: the Availability Zone does not match. Delete and recreate in the right zone.',done:'Extra volumes are attached.'},
 {t:'Connect to the instance',what:'Open a text window on the server.',why:'Formatting and mounting drives is done by typing commands.',where:'EC2 > Connect > EC2 Instance Connect tab (a browser terminal, easiest for beginners)',
  how:['Select your instance, click Connect, then Connect again.'],exp:'A black terminal appears with a prompt.',fix:'Connect fails: confirm SSH port 22 is allowed in the security group.',done:'I am connected to the server.'},
 {t:'Look at the drives',what:'List the drives the server can see.',why:'You need the new drive names before formatting.',where:'Terminal',
  cmds:[['lsblk','lsblk = "list block devices" (drives). It only reads, changes nothing, safe to repeat, free.']],
  exp:'A table. The 8 GB root drive has partitions; your new ones have no mount point. Names look like nvme1n1 or xvdb.',fix:'Name differs from examples: always use the names you see.',done:'I know my new drive names.'},
 {t:'Format, mount and test each new drive',what:'Prepare a blank drive, connect it to a folder, write a file.',why:'A new drive is like a blank disk: it needs a file system and a folder to appear in.',where:'Terminal',
  warn:'mkfs ERASES a drive. Run it only on the new empty volume, never the root drive (the one with partitions).',
  cmds:[['sudo mkfs -t xfs /dev/nvme1n1','sudo = run as administrator. mkfs = make file system (format). -t xfs = file system type. /dev/nvme1n1 = REPLACE with your new drive name. Destructive to that drive only.'],
        ['sudo mkdir /mnt/data1','mkdir = make folder. /mnt/data1 = the folder name you choose (the mount point).'],
        ['sudo mount /dev/nvme1n1 /mnt/data1','mount = attach the drive so it appears in that folder.'],
        ['df -h','df = disk free; -h = human-readable sizes. Shows every mounted drive. Screenshot this.'],
        ['cd /mnt/data1\nsudo touch test_file\necho "It works" | sudo tee test_file\ncat test_file','touch makes an empty file; tee writes text into it (sudo needed because / mnt is admin-owned); cat prints it. This matches your instructor hint, adapted for permissions.']],
  exp:'df -h lists your new drive on /mnt/data1; cat prints It works.',fix:'"mount: wrong fs type": the format step was skipped. "device busy": wrong drive name.',done:'Drive formatted, mounted and tested.'},
 {t:'Screenshot and clean up',what:'Capture evidence, then stop paying.',why:'Running resources can bill you.',where:'Browser and EC2 console',
  how:['Take both screenshots first.','Then EC2 > Instances > Instance state > Terminate; delete leftover volumes.'],warn:'Only terminate AFTER screenshots are saved.',exp:'State terminated; volumes gone.',fix:'Volume stuck: wait for the instance to finish terminating.',done:'Evidence saved and resources deleted.'}]},
{id:'m4cfg',t:'Module 4: MySQL Configuration',pts:15,due:'Nov 29',
 goal:'Install MariaDB (a MySQL-compatible database) on its own server and prove it is running. A database is an organized digital filing cabinet that programs can search quickly.',
 shots:['(Required) EC2 instance overview showing security group and drive type. Name: m4-instance.png','(Required) Output of sudo systemctl status mariadb. Name: m4-status.png','(Required) Output of sudo mysql -p. Name: m4-mysql.png'],
 steps:[
 {t:'Launch the instance',what:'Launch Amazon Linux 2023 AMI (HVM), the first option.',why:'This is the server the database will live on.',where:'EC2 > Launch instance',
  how:['Choose Amazon Linux 2023 AMI (first option).','Do not change root disk speed.','Security group: add rules SSH and MYSQL/Aurora. Create/select your key pair.','Launch, then take screenshot 1 of the instance overview with security group and drive type.'],
  warn:'MYSQL/Aurora opens port 3306 to the network. Class requirement; restrict the source to My IP if you can. Delete the instance later.',exp:'Running instance.',fix:'Cannot connect later: check the key pair and that SSH is allowed.',done:'Instance running and screenshot 1 taken.'},
 {t:'Connect',what:'Open a terminal on the server. Username is ec2-user.',why:'Commands are typed there.',where:'Windows: MobaXterm. Mac: Terminal or Terminus. Or EC2 Instance Connect in the browser.',
  how:['Use the public IP, user ec2-user, and your key file.'],exp:'Prompt like [ec2-user@ip-... ~]$',fix:'Permission denied (publickey): wrong key file or username.',done:'Connected.'},
 {t:'Update and install MariaDB',what:'Update the server, install and start the database.',why:'The software must exist and be running.',where:'Terminal',
  cmds:[['sudo dnf upgrade -y','sudo = admin. dnf = package installer. upgrade = update software. -y = answer yes automatically. Changes the server, free, repeatable.'],
        ['sudo dnf install mariadb105-server -y','install = add a program; mariadb105-server = the database server package.'],
        ['sudo systemctl start mariadb.service','systemctl = controls background services. start = turn it on.'],
        ['sudo systemctl status mariadb','Shows whether it runs. Screenshot 2. Press q to exit.']],
  exp:'Green text "active (running)".',fix:'Unit not found: the install failed; rerun the install command.',done:'MariaDB installed and running; screenshot 2 taken.'},
 {t:'Secure the server',what:'Run the security wizard.',why:'It sets a root password and removes unsafe defaults.',where:'Terminal',
  warn:'Your instructions list "sudo grep temporary password var/log/mysqld.log". The path lacks a leading / and MariaDB normally has no temporary password, so I skip it. If asked for a current password, just press Enter. Ask your instructor if unsure.',
  cmds:[['sudo mysql_secure_installation','Interactive. Instructor answers: Remove anonymous account? Y. Disallow remote root login? No. Remove test database? Yes. Reload privilege tables? Yes. Write down the password you set.']],
  exp:'Messages ending with "Thanks for using MariaDB!"',fix:'Mistyped an answer: just run the wizard again.',done:'Server secured; password noted.'},
 {t:'Create database and test login',what:'Log in and create a database named students.',why:'Proves MySQL works, and gives screenshot 3.',where:'Terminal',
  cmds:[['sudo mysql -p','mysql = open the database shell. -p = ask for password. Screenshot 3 after logging in.'],
        ['create database students;','Creates a database called students. Type exactly with the ;'],
        ["GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY 'your password';",'REPLACE your password (keep the quotes). Lets root connect from anywhere.'],
        ['flush privileges;','Reloads permissions.'],['exit;','Leaves the shell.']],
  warn:'Granting root access from any host is a BAD security practice. It is required here for class only.',exp:'Query OK messages; prompt MariaDB [(none)]>',fix:'Access denied: wrong password; rerun the secure step.',done:'Database created; screenshot 3 taken.'}]},
{id:'m4lab',t:'Module 4 Lab: MySQL Database',pts:20,due:'Nov 29',
 goal:'Practice SQL (the language used to talk to databases): make an admin user, a database and a table with at least 10 rows, and screenshot it. Needs the server from the previous assignment.',
 shots:['(Required) Newly created table with 10+ rows, via MySQL Workbench or terminal. Name: m4lab-table.png'],
 steps:[
 {t:'Log in and make a second admin',what:'Create a secondary admin account.',why:'Real servers have several admins.',where:'Terminal on your Module 4 instance',
  cmds:[['sudo mysql -p','Opens the shell.'],["GRANT ALL ON *.* TO 'myadmin'@'localhost' IDENTIFIED BY 'ChooseAPassword' WITH GRANT OPTION;",'myadmin and password are yours to pick. WITH GRANT OPTION lets this user give permissions to others.'],['FLUSH PRIVILEGES;','Applies changes.']],
  exp:'Query OK.',fix:'Syntax error: check quotes and semicolon.',done:'Second admin created.'},
 {t:'Create database and table',what:'Make a database and table with ID, First Name, Last Name, Hobby, Zip Code.',why:'A table is a spreadsheet inside the database.',where:'MySQL shell',
  warn:'Your instructor text lists these columns but the example picture shows employee columns. I follow the text; confirm if unsure.',
  cmds:[['CREATE DATABASE IF NOT EXISTS school;\nUSE school;','Creates and selects the database (name is yours).'],
        ['CREATE TABLE IF NOT EXISTS people (\nid INT,\nfirst_name VARCHAR(30),\nlast_name VARCHAR(30),\nhobby VARCHAR(30),\nzip_code VARCHAR(10),\nPRIMARY KEY (id)\n);','INT = whole number; VARCHAR(30) = text up to 30 characters; PRIMARY KEY = unique ID per row. Zip is text so leading zeros survive.'],
        ['DESC people;','Shows the table structure.']],exp:'Table description with 5 columns.',fix:'Table exists: fine because of IF NOT EXISTS.',done:'Table created.'},
 {t:'Insert 10 rows and screenshot',what:'Add at least 10 entries.',why:'The rubric requires 10 or more.',where:'MySQL shell',
  cmds:[["INSERT INTO people VALUES\n(1,'Ana','Lopez','Hiking','90745'),\n(2,'Ben','Kim','Chess','90746'),\n(3,'Cara','Diaz','Soccer','90247'),\n(4,'Dan','Wu','Baking','90710'),\n(5,'Eve','Ray','Reading','90731'),\n(6,'Finn','Cole','Surfing','90277'),\n(7,'Gia','Lee','Painting','90501'),\n(8,'Hal','Ng','Cycling','90802'),\n(9,'Ivy','Roe','Dancing','90210'),\n(10,'Jon','Fox','Gaming','90001');",'Adds 10 rows (sample data; change if you like). Never run twice or you get duplicate ID errors.'],['SELECT * FROM people;','Shows all rows. Take the screenshot of this result.']],
  exp:'Table with 10 rows.',fix:'Duplicate entry: the IDs already exist.',done:'Screenshot of 10-row table taken.'}]},
{id:'gen',t:'Module 6: Generate Data (Mockaroo)',pts:10,due:'Nov 29',
 goal:'Use a free website to create fake but realistic data: 10 related columns and 1000 rows. You will reuse this file in the RDS and Aurora labs.',
 shots:['(Required) Mockaroo screen showing your 10 fields and 1000 rows before download. Name: mock-fields.png','(Required) Proof the data is 10x1000, such as the downloaded CSV opened with row 1001 visible. Name: mock-size.png'],
 steps:[
 {t:'Design 10 related columns',what:'Pick one theme, e.g. workout time, average heart rate, calories burned.',why:'Related data makes later queries meaningful.',where:'https://mockaroo.com/',how:['Add 10 fields with a name and type each.','Set rows to 1000, format CSV.'],exp:'Field list of 10 and Rows: 1000.',fix:'Too few types: use Row Number, Number, Words, Dates.',done:'10 fields, 1000 rows configured.'},
 {t:'Screenshot, download, verify',what:'Screenshot the setup, then download the CSV.',why:'The screenshot before download is required.',where:'Mockaroo and Excel',how:['Screenshot the fields and row count.','Click Download Data.','Open the CSV: 1001 lines (1 header + 1000 rows), 10 columns. Screenshot it.'],exp:'CSV file in Downloads.',fix:'Zip code losing leading zeros in Excel: normal view issue.',done:'CSV downloaded and verified.'}]},
{id:'clean',t:'Module 5: Find and Clean Data',pts:15,due:'Nov 29',
 goal:'Download a real dataset, then fix its mess (inconsistent dates, capitalization, blanks, duplicates) and explain what you changed.',
 shots:['No screenshots required. Deliverable is a ZIP folder named like Mod05-Assignmt-YourLastName containing: original file, cleaned file (CSV or XLSX), and a Word file describing the cleanup.'],
 steps:[
 {t:'Pick and download a dataset',what:'Choose a small CSV or XLSX.',why:'You need messy data to clean.',where:'kaggle.com/datasets, the Tableau free data sets list, or github awesome-public-datasets (links from your assignment)',how:['Pick something under about 10,000 rows.','Save it and keep a copy named ORIGINAL.'],exp:'File on your computer.',fix:'Kaggle needs login: use another source.',done:'Original dataset saved.'},
 {t:'Clean it in Excel',what:'Fix problems and save as a new file.',why:'Clean data gives reliable answers (also used for the Athena lab).',where:'Excel',how:['Make dates one format; fix capitalization; remove duplicates (Data > Remove Duplicates); delete unneeded columns; handle blank cells.','Write down each change as you do it.','Save as CLEANED.csv.'],exp:'Cleaned file differs from the original.',fix:'Made a mistake: reopen ORIGINAL.',done:'Cleaned file saved.'},
 {t:'Write notes and zip',what:'Word doc listing every cleanup action; zip all three files.',why:'Rubric: before file 5, after file 5, Word explanation 5.',where:'Word, then right-click folder > compress/send to ZIP',how:['Name folder Mod05-Assignmt-YourLastName.'],exp:'One ZIP with 3 files.',fix:'Not sure: open the zip and count files.',done:'ZIP ready to submit.'}]}
];
var Q=[['Module 3-1: WordPress',15,'Nov 29'],['Module 3-2 Lab: EFS',15,'Nov 29'],['Module 4: NoSQL Concepts',15,'Nov 29'],['Module 5 Lab: Athena queries',20,'Nov 29'],['Module 6 Lab: RDS & Aurora',20,'Nov 29'],['Module 6: DynamoDB Skills Builder',20,'Nov 29'],['Module 6 Lab 2: RDS & MySQL',15,'Nov 29'],['Module 7-1: Rekognition',20,'Dec 6']];
function S(){try{return JSON.parse(localStorage.getItem('awshub')||'{}')}catch(e){return{}}}
function P(d){try{localStorage.setItem('awshub',JSON.stringify(d))}catch(e){}}
function pct(a){var s=S(),n=0;a.steps.forEach(function(_,i){if(s[a.id+':'+i])n++});return Math.round(100*n/a.steps.length)}
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function renderHome(){var h='',d=0;A.forEach(function(a){var p=pct(a);if(p==100)d++;h+='<a class="card" href="assignment.html?id='+a.id+'"><b>'+a.t+'</b><br><span class="tag">'+a.pts+' pts</span><span class="tag">Due '+a.due+'</span><span class="tag'+(p==100?' done':'')+'">'+p+'%</span><div class="bar"><i style="width:'+p+'%"></i></div></a>'});
Q.forEach(function(q){h+='<div class="card off"><b>'+q[0]+'</b><br><span class="tag">'+q[1]+' pts</span><span class="tag">Due '+q[2]+'</span><br><small>Guide not built yet</small></div>'});
document.getElementById('cards').innerHTML=h;var t=A.length+Q.length,o=Math.round(100*d/t);document.getElementById('ov').textContent=d+' of '+t+' completed, '+(t-d)+' remaining';document.getElementById('ovb').style.width=o+'%'}
function renderPage(){var id=new URLSearchParams(location.search).get('id'),i=A.findIndex(function(a){return a.id==id});if(i<0){location.href='index.html';return}var a=A[i];document.title=a.t;
var h='<h1>'+a.t+'</h1><p>'+a.goal+'</p><div class="lbl">Progress: <span id="pp"></span></div><div class="bar"><i id="pb"></i></div><h2>Screenshots and deliverables</h2><ul>'+a.shots.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul><h2>Steps</h2>';
a.steps.forEach(function(s,k){h+='<div class="step" id="s'+k+'"><h3>Step '+(k+1)+': '+s.t+'</h3><div class="lbl">What are we doing?</div>'+s.what+'<div class="lbl">Why?</div>'+s.why+'<div class="lbl">Where?</div>'+s.where;
if(s.how)h+='<div class="lbl">Instructions</div><ol>'+s.how.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ol>';
if(s.warn)h+=W+s.warn+'</div>';
if(s.cmds)s.cmds.forEach(function(c){h+='<pre>'+esc(c[0])+'</pre><div><b>Understanding the command:</b> '+c[1]+'</div>'});
h+='<div class="lbl">Expected result</div>'+s.exp+'<div class="lbl">If something goes wrong</div>'+s.fix+'<label class="chk"><input type="checkbox" data-k="'+a.id+':'+k+'"><span><b>Done:</b> '+s.done+'</span></label></div>'});
h+='<div class="warn"><b>Cost and security:</b> delete servers and volumes when you are done, after your screenshots are saved. Never share key files or passwords.</div><button id="rs">Reset this assignment</button><div class="pn"><span>'+(i>0?'<a href="assignment.html?id='+A[i-1].id+'">&larr; '+A[i-1].t+'</a>':'')+'</span><span>'+(i<A.length-1?'<a href="assignment.html?id='+A[i+1].id+'">'+A[i+1].t+' &rarr;</a>':'')+'</span></div>';
document.getElementById('m').innerHTML=h;
function up(){var p=pct(a);document.getElementById('pp').textContent=p+'%';document.getElementById('pb').style.width=p+'%';document.querySelectorAll('input[data-k]').forEach(function(c){c.checked=!!S()[c.dataset.k];c.closest('.step').classList.toggle('ok',c.checked)})}
document.querySelectorAll('input[data-k]').forEach(function(c){c.onchange=function(){var s=S();if(c.checked)s[c.dataset.k]=1;else delete s[c.dataset.k];P(s);up()}});
document.getElementById('rs').onclick=function(){if(confirm('Reset all progress for this assignment?')){var s=S();a.steps.forEach(function(_,k){delete s[a.id+':'+k]});P(s);up()}};up()}
