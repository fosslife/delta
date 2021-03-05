function URLShortner() {
    return (
        <div id="urlshortner">
            <div className="container mt-2">
                <div className="columns">
                    <div className="column col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title h5">
                                    <h3>Shorten URL</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="shortenurl"
                                    >
                                        Paste an URL
                                    </label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        id="shortenurl"
                                        placeholder="URL"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default URLShortner;
