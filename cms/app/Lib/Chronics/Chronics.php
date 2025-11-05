<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeEventManager', 'Event');
App::uses('ChronicJobInterface', 'Lib' . DS . 'Chronics');
App::uses('Path', 'Lib');

class Chronics {
    const _JOBS_CACHE_KEY = 'HeO2.Chronics.jobs';
    const _JOBS_DIRECTORY = 'Lib/Chronics/Jobs';
    const _MANIFEST_FILENAME = 'manifest';
    const _PARSE_EVENT_STRING_REGEX = '/(.+)\[(\d+)\]/';

    private static $_jobs = [];
    private static $_instances = [];
    private static $_listeners = [];

    public static function _init() {
        self::$_jobs = Cache::read(self::_JOBS_CACHE_KEY);
        if (empty(self::$_jobs)) {
            HeO2Log::chronics('Initializing Chronics from scratch');
            self::_indexJobs();
        } else{
            HeO2Log::chronics('Restoring Chronics from cache');
            self::_restoreListeners();
        }
    }

    public static function run($jobId) {
        HeO2Log::chronics_1('Running job %s', $jobId);

        if (isset(self::$_jobs[$jobId])) {
            self::_getJobInstance($jobId)->execute();
        }
    }

    public static function schedule($jobId, Recurrent $recurrent) {

    }

    public static function registerJob($jobId, $manifest, $classOrRef, $script = null) {
        HeO2Log::chronics_1('Registering job %s implemented in %s', $jobId, is_object($classOrRef) ? get_class($classOrRef) : $classOrRef);
        HeO2Log::dump('chronics-1', $manifest);

        self::$_jobs[$jobId] = [
            'jobId' => $jobId,
            'class' => is_string($classOrRef) ? $classOrRef : null,
            'script' => $script,
            'manifest' => $manifest
        ];

        if (!is_string($classOrRef)) {
            self::$_instances[$jobId] = $classOrRef;
        }

        self::_registerJobEvents(self::$_jobs[$jobId]);
    }

    private static function unregisterJob($jobId) {
        HeO2Log::chronics_1('Unregistering job %s', $jobId);

        self::_unregisterJobEvents($jobId);
        unset(self::$_jobs[$jobId]);
        unset(self::$_listeners[$jobId]);
        unset(self::$_instances[$jobId]);
    }


    /* PRIVATE*/
    private static function _getJobInstance($jobId) {
        if (empty(self::$_instances[$jobId])) {
            require self::$_jobs[$jobId]['script'];
            self::$_instances[$jobId] = new self::$_jobs[$jobId]['class']();
        }

        return self::$_instances[$jobId];
    }

    private static function _indexJobs() {
        $jobsDir = Path::join(APP, self::_JOBS_DIRECTORY);
        $jobsDirHandle = opendir($jobsDir);
        while ($jobDir = readdir($jobsDirHandle)) {
            if (!in_array($jobDir, ['.', '..'])) {
                $jobDir = Path::join($jobsDir, $jobDir);
                self::_readJob($jobDir);
            }
        }

        Cache::write(self::_JOBS_CACHE_KEY, self::$_jobs);
    }

    private static function _parseEvent($eventString) {
        $matches = null;
        if (preg_match(self::_PARSE_EVENT_STRING_REGEX, $eventString, $matches)) {
            return [
                'name' => $matches[1],
                'priority' => $matches[2]
            ];
        }

        return [
            'name' => $eventString,
            'priority' => 10
        ];
    }

    private static function _readJob($directory) {
        $manifest = self::_readManifest($directory);
        $class = Path::baseFilename($directory);
        self::registerJob(
            $manifest['jobId'], $manifest, $class, Path::Join($directory, $class, '.php')
        );
    }

    private static function _readManifest($directory) {
        $manifestPath = Path::join($directory, self::_MANIFEST_FILENAME);
        if (!Path::exist($manifestPath)) {
            throw new ErrorException("Chronics | Missing manifest at '{$directory}'");
        }

        return json_decode(file_get_contents($manifestPath), true);
    }

    private static function _registerJobEvents($job) {
        if (!empty($job['manifest']['triggers'])) {
            foreach ($job['manifest']['triggers'] as $eventString => $methodName) {
                $jobInstance = self::_getJobInstance($job['jobId']);
                $event = self::_parseEvent($eventString);

                $eventName = $event['name'];
                self::$_listeners[$job['jobId']][$event['name']] = function ($event) use ($methodName, $jobInstance, $job, $eventName) {
                    HeO2Log::chronics_2("Event {$eventName} invoked for job {$job['jobId']}");

                    $jobInstance->{$methodName}($event);
                };

                CakeEventManager::instance()->attach(self::$_listeners[$job['jobId']][$event['name']], $event['name'], ['priority' => $event['priority']]);

                HeO2Log::chronics_1("Attaching event {$event['name']} for job {$job['jobId']}");
            }
        }
    }

    private static function _restoreListeners() {
        foreach (self::$_jobs as $job) {
            if (!empty($job['manifest']['triggers'])) {
                HeO2Log::chronics("Restoring job {$job['jobId']}");
                self::_registerJobEvents($job);
            }
        }
    }

    private static function _unregisterJobEvents($jobId) {
        if (!empty(self::$_listeners[$jobId])) {
            foreach (self::$_listeners[$jobId] as $listener) {
                CakeEventManager::instance()->detach($listener);
            }
        }
    }
}
