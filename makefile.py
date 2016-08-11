#!/usr/bin/python

import os
import sys
import subprocess
import time

usage_error_string = 'Usage : directory_sunc.py [start|stop] [source_directory] [destination_directory]'
script_path = '/users/ironstein/Documents/projects_working_directory/python_deamons/directory_sync/directory_sync.py'
sites_path = '/Users/ironstein/Sites/'
path_to_html_file = '/index.html'

def remove_duplicates(l) : 
    available_elements = []
    for element in l : 
        if element not in available_elements : 
            available_elements.append(element)
    return available_elements

def get_available_indexes() : 
    directory_sync_available_indexes = []
    for root, dirs, files in os.walk('/tmp/') : 
        for file in files :
            if 'directory_sync' in file : 
                directory_sync_available_indexes.append(file.split('_')[-1].split('.')[0])
    directory_sync_available_indexes = remove_duplicates(directory_sync_available_indexes)
    return directory_sync_available_indexes

if __name__ == '__main__' :
    if len(sys.argv) == 2 : 
        pass 
    elif len(sys.argv) == 3 and sys.argv[0] == 'python' : 
        sys.argv = sys.argv[1:]    
    else :
        print(usage_error_string)
        raise SystemExit(1)

    working_directory_list = os.path.realpath(__file__).split(os.sep)[:-1]
    working_directory = ''
    for element in working_directory_list : 
        working_directory += element + os.sep
    root_directory_name = working_directory.split(os.sep)[-2]

    if sys.argv[1] == 'start' :
        available_indexes = get_available_indexes()
        print(available_indexes)
        os.system('mkdir ' + sites_path + root_directory_name)
        os.system(script_path + ' start ' + working_directory + ' ' + sites_path + root_directory_name + ' 1.0')
        time.sleep(2)
        updated_available_indexes = get_available_indexes()
        for element in updated_available_indexes : 
            if element not in available_indexes : 
                try : 
                    os.system('rm ' + working_directory + 'index.txt')
                except : 
                    pass
                os.system('echo ' + element + ' >> ' + working_directory + 'index.txt')
        # apachectl start
        # tutorial to setup apache on mac : https://ole.michelsen.dk/blog/setup-local-web-server-apache-php-osx-yosemite.html
        p = subprocess.Popen(['apachectl', 'start'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        stdout, stderr = p.communicate(input='Ironman1994\n')
        # browser-sync start --proxy="http://localhost/~ironstein/portfolio/framework/test.html" --files="*"
        command = 'browser-sync start --proxy="http://localhost/~ironstein/' + root_directory_name + path_to_html_file + '" -f '
        command += '"' + working_directory + '*" '
        for root, dirs, files in os.walk(working_directory) : 
            for directory in dirs : 
                command += '"' + os.path.join(root, directory) + '/*" '
        print(command)
        os.system(command)

    elif sys.argv[1] == 'stop' :
        with open(working_directory + 'index.txt') as f : 
            index = f.read() 
            os.system(script_path + ' stop directory_sync_' + index)
