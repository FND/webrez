create web presentations from Markdown

based on [Shower](http://shwr.me)


Getting Started
---------------

* ensure that [`Markdown.pl`](http://daringfireball.net/projects/markdown/) is
  available on your `PATH`
* `git submodule update --init`
* edit `index.md`
* run `./build`


Extensibility
-------------

customizations can be included in the respective template file

for example, this allows using
[Prettify](http://google-code-prettify.googlecode.com/svn/trunk/README.html) for
syntax highlighting simply by adding a `SCRIPT` tag and ensuring the respective
code blocks have the required class


Structure
---------

Each source file starts with two lines for the presentation's title and
subtitle, respectively, followed by a blank line. Subsequently, each slide is
introduced either by an `HR.slide` or by `HR + H1`:

    My Presentation
    My Tagline


    <hr class=slide>

    * foo
    * bar
    * baz


    ----
    # Hello World

    lorem ipsum
    dolor sit amet


The former allows for custom slide classes:

    <hr class="slide my-custom-type">

    ...

In addition, individual elements can be customized by preceding them with an
`HR.pragma` whose attributes are automatically transferred to the respective
element:

    <hr class="pragma my-custom-class" style="color: red;">
    ## Attention!

... will result in

    <h2 class="my-custom-class" style="color: red;">Attention!</h2>

See the default `index.md` for examples.

Optional speaker notes are displayed in the browser console:

    ----
    # Hello World

    lorem ipsum
    dolor sit amet

    <hr class="pragma notes">

    * this is just a sample slide
    * it illustrates how speaker notes are used
