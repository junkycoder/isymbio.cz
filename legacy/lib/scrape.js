/**
 * Scrape script
 *
 * Written especially for http://isymbio.cz/ website
 */
module.exports = () => {
    const contentElement = document.querySelector('#content');

    const links = [...contentElement.querySelectorAll('a[href]')].map(
        link => link.href,
    );

    let content = contentElement.innerHTML;

    return {
        document: {
            title: document.title,
            links,
        },

        content,
        location: {
            href: location.href,
            host: location.host,
            origin: location.origin,
        },
    };
};
