<?php

class BuildInfo {
    public static function makeInfoString($build) {
        $content = file_get_contents(Configure::read('BuildInfo.path'));
        if (empty($content)) {
            return "<build info unknown>";
        }

        $buildInfo = json_decode($content, true);
        return "Build {$build} running on {$buildInfo['environment']}";
    }
}
