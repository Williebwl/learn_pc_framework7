define(['core.Service'],
    function (core) {
        'use strict'

        function tagService() {
            this.fnGetTagByTagClass = function (tagClass) {
                return this.get('GetTagByTagClass', { params: { tagClass: tagClass } })
            }
        }

        function tagClassService() {

        }

        return core.service('tagClass', tagClassService, 'Tag/TagClass').service('tag', tagService, 'Tag/Tag');
    });