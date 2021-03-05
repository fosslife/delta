import FileUploader from './FileUploader';
import URLShortner from './URLShortner';

function Content({ tab }) {
    return tab === 'fileuploader' ? (
        <FileUploader />
    ) : tab === 'urlshortner' ? (
        <URLShortner />
    ) : null;
}

export default Content;
