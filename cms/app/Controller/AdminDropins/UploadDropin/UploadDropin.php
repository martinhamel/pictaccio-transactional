<?php


App::uses('TempFiles', 'Lib');
App::uses('Path', 'Lib');
App::uses('CsvReader', 'Lib');

class UploadDropin extends AdminDropin {
    const _UNPACK_DIRECTORY = 'tmp/paks';

    public function index() {
        $this->_loadModel('Session');
        $this->_loadModel('Picture');
        $this->_set('sessionsArray', $this->Session->find('all'));
        $this->_set('uploads', '[]');
    }

    public function view($sessionId) {
        $this->_loadModel('Picture');
        $this->_loadModel('GroupPicture');
        $this->_set('subjects', $this->Picture->findBySessionId($sessionId));
        $this->_set('groups', $this->GroupPicture->findBySessionId($sessionId));
    }

    public function track($pictureId) {
        $this->_loadModel('Track');
        $this->_set('track', $this->Track->findByPictureId($pictureId));
    }

    public function upload() {
        $this->_loadModel('Picture');
        $this->_loadModel('GroupPicture');
        $this->_host->renderJson($this->_unpack());
    }


    /* PRIVATE */
    private function _commit($csvReader, $tmpDir) {
        $status = [];
        $groups = [];

        foreach ($csvReader->rows() as $line) {
            if (!empty($line['code']) && !$this->Picture->codeExist($line['code'])) {
                $pictures = $this->_prepareSubjectPictures($line, $tmpDir);
                if (!empty($pictures)) {
                    if (!empty($line['groupe']) && !in_array(trim($line['groupe']), $groups)) {
                        $groups[] = trim($line['groupe']);
                    } else if (!empty($line['Groupe']) && !in_array(trim($line['Groupe']), $groups)) {
                        $groups[] = trim($line['Groupe']);
                    }
                    $this->Picture->create();
                    $saved = $this->Picture->save([
                        'session_id' => $this->_request->data['id'],
                        'code' => $line['code'],
                        'display_name' => $this->_makeDisplayName($line),
                        'subject_json' => json_encode($this->_prepareSubjectInfo($line)) ?: '{}',
                        'pictures_json' => json_encode($pictures),
                        'gpi' => $line['GPI']
                    ]);
                    $status[] = [
                        'status' => $saved ? 'ok' : 'fail',
                        'error' => $saved ? false : 'Could not save to database',
                        'id' => $saved ? $this->Picture->id : null,
                        'line' => json_encode($line)
                    ];
                }
            } else{
                $status[] = [
                    'status' => 'fail',
                    'error' => 'Code is either empty or already assigned.',
                    'line' => json_encode($line)
                ];
            }
        }

        foreach ($groups as $group) {
            $pictures = $this->_prepareGroupPictures($group, $tmpDir);
            if (!empty($pictures)) {
                $this->GroupPicture->create();
                $saved = $this->GroupPicture->save([
                    'session_id' => $this->_request->data['id'],
                    'group' => $group,
                    'pictures_json' => json_encode($pictures)
                ]);
                $status[] = [
                    'status' => $saved ? 'ok' : 'fail',
                    'error' => $saved ? false : 'Could not save to database',
                    'id' => $saved ? $this->GroupPicture->id : null,
                    'group' => $group
                ];
            }
        }

        return $status;
    }

    private function _extractGroupPak($tmpPak) {
        $zipPak = new ZipArchive();
        if ($zipPak->open($tmpPak)) {
            Path::makeDirectory($tmpPak . '.d');
            $zipPak->extractTo($tmpPak . '.d');
            $zipPak->close();
        } else{
            throw new UnknownException('Cannot open group.pak');
        }
    }

    private function _makeDisplayName($line) {
        $line = array_change_key_case($line);
        $displayName = '';

        if (isset($line['prenom'])) {
            $displayName = $line['prenom'];
        }
        if (isset($line['prénom'])) {
            $displayName = $line['prénom'];
        }
        if (isset($line['first_name'])) {
            $displayName = $line['first_name'];
        }
        if (isset($line['firstname'])) {
            $displayName = $line['firstname'];
        }

        if (isset($line['nom'])) {
            $displayName .= ' ' . $line['nom'];
        }
        if (isset($line['nom_de_famille'])) {
            $displayName .= ' ' . $line['nom_de_famille'];
        }
        if (isset($line['nomdefamille'])) {
            $displayName .= ' ' . $line['nomdefamille'];
        }
        if (isset($line['last_name'])) {
            $displayName .= ' ' . $line['last_name'];
        }
        if (isset($line['lastname'])) {
            $displayName .= ' ' . $line['lastname'];
        }

        return $displayName;
    }

    private function _unpack() {
        $tempFiles = new TempFiles();
        $pak = $tempFiles->get()['group_pak'];
        $tmpPak = Path::uniqueFilename(Path::join(APP, self::_UNPACK_DIRECTORY));
        $pak->move($tmpPak);
        $this->_extractGroupPak($tmpPak);
        $groupCsv = CsvReader::create(Path::join($tmpPak . '.d', 'group.csv'), ['hasHeader' => true]);
        $status = $this->_commit($groupCsv, $tmpPak . '.d');
        $groupCsv->close();
        Path::delete($tmpPak);
        Path::delete($tmpPak . '.d', true);

        return $status;
    }

    private function _prepareGroupPictures($group, $tmpDir) {
        $pictures = Path::filter("group_{$group}[._]*", $tmpDir);
        foreach ($pictures as &$picture) {
            $destination = Path::uniqueFilename(Configure::read('Directories.pictures'), Path::filename($picture));
            Path::move($picture, $destination);
            $picture = str_replace(WWW_ROOT, '', $destination);
        }

        return $pictures;
    }

    private function _prepareSubjectInfo($line) {
        $subject = $line;
        if (isset($subject['Groupe'])) {
            $subject['groupe'] = $subject['Groupe'];
            unset($subject['Groupe']);
        }
        unset($subject['code']);
        return $subject;
    }

    private function _prepareSubjectPictures($line, $tmpDir) {
        $pictures = Path::filter("{$line['code']}*", $tmpDir);
        foreach ($pictures as &$picture) {
            $destination = Path::join(Configure::read('Directories.pictures'), Path::filename($picture));
            Path::move($picture, $destination);
            $picture = str_replace(WWW_ROOT, '', $destination);
        }

        return $pictures;
    }
}
