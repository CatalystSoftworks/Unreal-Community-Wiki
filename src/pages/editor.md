---
title: Editor Help
description: Need help understanding how our custom editor works? This article outlines the functionality available to you when creating content around the Unreal Engine.
---

{{note}}

This article is still a work in progress.

{{/note}}

# Markdown

This site's editor uses [Markdown](https://www.markdownguide.org/) as the foundation for its formatting and editor experience. Markdown was chosen for its broad appeal and shallow learning curve. The majority of Markdown's basic features are supported, you can [read this article](https://www.markdownguide.org/basic-syntax/) for a more in-depth look at how Markdown works if you're unfamiliar.

### Supported Features

- [x] Strong/Bold Text
- [x] Emphasis/Italic Text
- [x] Strikethrough
- [x] Headings
- [x] Blockquotes
- [x] Links
- [x] Images
- [x] Ordered lists
- [x] Unordered lists
- [x] Checkmark lists
- [x] Tables

# Images

They say an image is worth a thousand words, which makes images incredibly useful when trying to write a guide or tutorial. The editor currently supports image uploading using one of 2 techniques.

## Linking an existing image

If you want to use link an existing image, you can simply use the Markdown syntax for images: `![Alt text](https://example.com/path/to/image.jpg)`

Please note that this requires that the image already be hosted somewhere.

## Uploading a new image

If you don't already have the image uploaded somewhere, don't worry! You can upload one to our servers and the image tag will be automatically added to your revision. Either copy + paste the image into the editor space where you want the image to be or drag and drop the image into the editor space. _There is currently a limit of 100mb per image._

{{tip}}

Make sure to change edit the "alt text" of your uploaded image. This is the area in between the square brackets (`[]`) in the inserted image tag. This alt text will be used if the image can't be loaded or will be read to user's utilizing screen readers.

{{/tip}}

# YouTube Embeds

You can link youtube videos by simply inserting the URL of a YouTube video on its own line, surrounded by at least 1 blank line on both sides.

### Example

```md

https://www.youtube.com/watch?v=d1ZnM7CH-v4

```

Will be converted to:

https://www.youtube.com/watch?v=d1ZnM7CH-v4

# Hints

Often it's useful to group information into eye-catching blocks that provide a bit more context around their contents. For this you can use hint blocks. Hints are color-coded blocks with a leading text defining the general context of the hint.

{{note}}

You may have noticed hints were already being used on this page!

{{/note}}

To make a hint, you must define an opening (`{{TYPE}}`) and closing (`{{/TYPE}}`) tags (just like tags in XML/HTML). Additionally, you need to make sure that there is at least 1 blank line above and below the opening and closing tags.

Type | Description
-----|------------
`{{tip}}` | Used for denoting additional information may be a non-standard, but useful approach to solving a problem.
`{{note}}` | Used for denoting additional information that may be non-obvious or easily overlooked.
`{{warning}}` | Used to provide cautionary information.
`{{danger}}` | Used to provide dangerous information that needs to be considered.
`{{success}}` | Used to mark a success step with potential "after step" instructions.
`{{todo}}` | Used to denote the need for additional information to be filled out later by the original author or another user.


### Example

```md
{{success}}

This is an example of a "success" tag.

{{/success}}
```

Will be converted to:

{{success}}

This is an example of a "success" tag.

{{/success}}

# Version Preference Blocks

Now for something for more unique. You may have noticed a dropdown that appears when viewing pages on this site. This checkbox allows you to select a preferred version of Unreal Engine that you may be working with. Some pages may use version blocks to show/hide content based on a specific version selection.

Version blocks are used in a similar fashion to [hints](#hints), but rely on attributes to determine what version(s) the encapsulated content will be shown. You can only provide each type of attribute once, and each attribute is calculated independently. This means _if one attribute fails its check, then the content will not be shown._

```md
{{version gte="4.25" lt="5"}}

This content will only be shown when the user has selected
version 4.25, 4.26, 4.27, and so on...

...but will not show when version 5 is selected.

{{/version}}
```

Attribute | Description
----------|------------
`gt` | The content will be shown if the selected version is _greater than_ the number provided by this attribute.
`gte` | The content will be shown if the selected version _greater than or equal to_ the number provided by this attribute.
`lt` | The content will be shown if the selected version is less than_ the number provided by this attribute.
`lte` | The content will be shown if the selected version less than or equal to_ the number provided by this attribute.
`is` | The content will be shown if the selected version is equal to the number provided by this attribute.

# Blueprint

Yet another unique feature to this site is the support for Blueprint rendering. With Blueprint only gaining more and more popularity, it only makes sense to support them on the site. Blueprint rendering is handled by the excellent [Blueprint UE](https://blueprintue.com) website.

When editing a page, you can use the "Embed Blueprint" button to automatically create and embed a Blueprint via the external service without the need to create your own account. Embedded blueprints use the following syntax, where the `id` attribute correlates to the ID provided by [Blueprint UE](https://blueprintue.com) on upload.

```md
{{blueprint id="xxxxxxxx"}}
```

{{note}}

Though the syntax for Blueprint embedding is similar to that of [hints](#hints) and [versions](#version-preference-blocks), it is a single line directive and does not need a closing tag.

{{/note}}