import { useState } from 'react';
import Content from './components/Conent';
function App() {
    const [tab, setTab] = useState('fileuploader');
    return (
        <div className="container">
            <div className="columns">
                <div className="column col-7 col-mx-auto">
                    <ul className="tab tab-block">
                        <li className="tab-item">
                            <a
                                href="#fileuploader"
                                className={
                                    tab === 'fileuploader' ? 'active' : ''
                                }
                                onClick={() => setTab('fileuploader')}
                            >
                                File Uploader
                            </a>
                        </li>
                        <li className="tab-item">
                            <a
                                href="#urlshortner"
                                className={
                                    tab === 'urlshortner' ? 'active' : ''
                                }
                                onClick={() => setTab('urlshortner')}
                            >
                                URL shortner
                            </a>
                        </li>
                        {false && (
                            <li className="tab-item">
                                <a href="#pastebin">Pastebin</a>
                            </li>
                        )}
                    </ul>

                    {/* Content */}
                    <Content tab={tab} />
                </div>
            </div>
        </div>
    );
}

export default App;
