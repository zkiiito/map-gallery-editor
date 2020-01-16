module.exports = {
    definitions: {
        mapslide: {
            type: 'object',
            required: [
                'id',
                'from',
                'to',
                'speed',
                'mode',
            ],
            properties: {
                id: {
                    $id: '#/properties/slides/items/properties/id',
                    type: 'string',
                    title: 'The Id Schema',
                    default: '',
                    examples: [
                        '7bdcf94e-42cf-4155-b7f8-924f5346c8b2',
                    ],
                    pattern: '^(.*)$',
                },
                from: {
                    $id: '#/items/properties/from',
                    type: 'string',
                    title: 'The From Schema',
                    default: '',
                    examples: [
                        'Budapest',
                    ],
                    pattern: '^(.*)$',
                },
                waypoints: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [
                            'location',
                        ],
                        properties: {
                            location: {
                                type: 'string',
                            },
                        },
                    },
                },
                to: {
                    $id: '#/items/properties/to',
                    type: 'string',
                    title: 'The To Schema',
                    default: '',
                    examples: [
                        'Vienna',
                    ],
                    pattern: '^(.*)$',
                },
                speed: {
                    $id: '#/items/properties/speed',
                    type: 'number',
                    title: 'The Speed Schema',
                    default: 0.0,
                    examples: [
                        291505.30628251797,
                    ],
                },
                mode: {
                    $id: '#/items/properties/mode',
                    type: 'string',
                    title: 'The Mode Schema',
                    default: '',
                    examples: [
                        'DRIVING',
                    ],
                    pattern: '^(.*)$',
                },
            },
        },
        imageslide: {
            type: 'object',
            required: [
                'filename',
                'path',
                'exif_date',
                'modified_at',
                'visible',
                'id',
                'thumbnail',
            ],
            properties: {
                id: {
                    $id: '#/properties/slides/items/properties/id',
                    type: 'string',
                    title: 'The Id Schema',
                    default: '',
                    examples: [
                        '7bdcf94e-42cf-4155-b7f8-924f5346c8b2',
                    ],
                    pattern: '^(.*)$',
                },
                filename: {
                    $id: '#/items/properties/filename',
                    type: 'string',
                    title: 'The Filename Schema',
                    default: '',
                    examples: [
                        '2016-09-29 17.17.32.jpg',
                    ],
                    pattern: '^(.*)$',
                },
                path: {
                    $id: '#/items/properties/path',
                    type: 'string',
                    title: 'The Path Schema',
                    default: '',
                    examples: [
                        'E:\\Downloads\\photos\\Lviv 2016\\2016-09-29 17.17.32.jpg',
                    ],
                    pattern: '^(.*)$',
                },
                exif_date: {
                    $id: '#/items/properties/exif_date',
                    type: 'string',
                    title: 'The Exif_date Schema',
                    default: '',
                    examples: [
                        '2016-09-29T17:17:32.000Z',
                    ],
                    pattern: '^(.*)$',
                },
                modified_at: {
                    $id: '#/items/properties/modified_at',
                    type: 'string',
                    title: 'The Modified_at Schema',
                    default: '',
                    examples: [
                        '2016-09-29T14:17:33.000Z',
                    ],
                    pattern: '^(.*)$',
                },
                visible: {
                    $id: '#/items/properties/visible',
                    type: 'boolean',
                    title: 'The Visible Schema',
                    default: false,
                    examples: [
                        true,
                    ],
                },
                thumbnail: {
                    $id: '#/items/properties/thumbnail',
                    type: 'string',
                    title: 'The Thumbnail Schema',
                    default: '',
                    examples: [
                        'C:/thumbs/thumb_2016-09-29 17.17.32.jpg',
                    ],
                    pattern: '^(.*)$',
                },
                source: {
                    $id: '#/items/properties/source',
                    type: 'string',
                    title: 'The Source Schema',
                    default: '',
                    examples: [
                        'flickr',
                    ],
                    pattern: '^([a-z-]+)$',
                },
            },
        },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://example.com/root.json',
    type: 'object',
    title: 'The Root Schema',
    required: [
        'slides',
    ],
    properties: {
        slides: {
            type: 'array',
            items: {
                $id: '#/items',
                type: 'object',
                title: 'The Items Schema',
                oneOf: [
                    {
                        $ref: '#/definitions/mapslide',
                    },
                    {
                        $ref: '#/definitions/imageslide',
                    },
                ],
            },
        },
    },
};
