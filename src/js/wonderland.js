// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Redirect, browserHistory} from 'react-router';
import 'babel-polyfill';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import UTILS from './modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Pages
import SignInPage from './components/pages/SignInPage';
import SignOutPage from './components/pages/SignOutPage';
import NotFoundPage from './components/pages/NotFoundPage';
import HomePage from './components/pages/HomePage';
import TimelinePage from './components/pages/TimelinePage';
import AccountConfirmedPage from './components/pages/AccountConfirmedPage';
import UserResetPage from './components/pages/UserResetPage';
import UserForgotPage from './components/pages/UserForgotPage';
import TermsPage from './components/pages/TermsPage';
import IntegrationsPage from './components/pages/IntegrationsPage';
import NewIntegrationPage from './components/pages/NewIntegrationPage';
import IntegrationsBrightcovePage from './components/pages/IntegrationsBrightcovePage';
import PluginsBrightcoveWizardPage from './components/pages/PluginsBrightcoveWizardPage';
import AccountSettingsPage from './components/pages/AccountSettingsPage';
import UserSettingsPage from './components/pages/UserSettingsPage';
import TelemetryPage from './components/pages/TelemetryPage';
import SupportPage from './components/pages/SupportPage';
import URLShortenerPage from './components/pages/URLShortenerPage';
import DemoPage from './components/pages/DemoPage';
import CookiesPage from './components/pages/CookiesPage';
import XXPage from './xx/XXPage';
import XXPageMobile from './xx/XXPageMobile';
import XXOnboarding from './xx/XXOnboarding';
import XXBlankCanvas from './xx/XXBlankCanvas';
import ConfirmAccountPage from './components/pages/ConfirmAccountPage';
import DemoUploadPage from './components/pages/DemoUploadPage';
import TRACKING from './modules/tracking';
import CollectionsMainPage from './components/pages/CollectionsMainPage';
import ViewSharedCollectionPage from './components/pages/ViewSharedCollectionPage';
import OnboardingUploadPage from './components/pages/OnboardingUploadPage';
import PhotoDisplayPage from './components/pages/PhotoDisplayPage';


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const CONFIG = require('../../env/config.json');
window.CONFIG = CONFIG;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

render((
        <Router history={browserHistory} onUpdate={TRACKING.logPageView}>

        {/* Routes should (where possible) use the DRY_NAV variable */}

        <Redirect from={UTILS.DRY_NAV.DASHBOARD.URL} to={UTILS.DRY_NAV.COLLECTIONS.URL} />
        <Redirect from={UTILS.DRY_NAV.VIDEO_LIBRARY.URL} to={UTILS.DRY_NAV.COLLECTIONS.URL} />

        <Route path={UTILS.DRY_NAV.AIRBNB_PHOTO_ANALYSIS.URL} component={PhotoDisplayPage} />
        <Route path={UTILS.DRY_NAV.HOME.URL} component={HomePage} />

        <Route path={UTILS.DRY_NAV.SIGNIN.URL} component={SignInPage} />
        <Route path={UTILS.DRY_NAV.SIGNOUT.URL} component={SignOutPage} />

        <Route path={UTILS.DRY_NAV.ACCOUNT_CONFIRMED.URL} component={AccountConfirmedPage} />
        <Route path={UTILS.DRY_NAV.ACCOUNT_CONFIRM.URL} component={ConfirmAccountPage} />

        <Route path={UTILS.DRY_NAV.USER_FORGOT.URL} component={UserForgotPage} />
        <Route path={UTILS.DRY_NAV.USER_RESET.URL + 'token/:token/username/:username'} component={UserResetPage} />

        <Route path={UTILS.DRY_NAV.ONBOARDING_VIDEO_UPLOAD.URL} component={DemoUploadPage} />

        {/* The direct_* routes are used by the precompiler proxy to get the page from origin */}
        <Route path="/direct_share/video/:videoId/account/:accountId/token/:shareToken/(index.html)" component={ViewSharedCollectionPage} />
        <Route path="/share/video/:videoId/account/:accountId/token/:shareToken/(index.html)" component={ViewSharedCollectionPage} />
        <Route path="/direct_share/collection/:tagId/account/:accountId/token/:shareToken/(index.html)" component={ViewSharedCollectionPage} />
        <Route path="/share/collection/:tagId/account/:accountId/token/:shareToken/(index.html)" component={ViewSharedCollectionPage} />

        <Route path={UTILS.DRY_NAV.TERMS.URL} component={TermsPage} />
        <Route path={UTILS.DRY_NAV.TELEMETRY.URL} component={TelemetryPage} />

        <Route path={UTILS.DRY_NAV.PLUGINS.URL} component={IntegrationsPage} />
        <Route path={UTILS.DRY_NAV.PLUGINS_NEW.URL} component={NewIntegrationPage} />
        <Route path={UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE_WIZARD.URL} component={PluginsBrightcoveWizardPage} />
        <Route path={UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL} component={IntegrationsBrightcovePage} />
        <Route path={UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL + ':usesGallery'} component={IntegrationsBrightcovePage} />
        <Route path={UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL + ':usesGallery'} component={IntegrationsBrightcovePage} />
        <Route path="/integration/brightcove/:integrationId" component={IntegrationsBrightcovePage} />
        <Route path={UTILS.DRY_NAV.SETTINGS_ACCOUNT.URL} component={AccountSettingsPage} />
        <Route path={UTILS.DRY_NAV.SETTINGS_USER.URL} component={UserSettingsPage} />
        <Route path={UTILS.DRY_NAV.SUPPORT.URL} component={SupportPage} />

        <Route path={UTILS.DRY_NAV.URL_SHORTENER.URL} component={URLShortenerPage} />
        <Route path={UTILS.DRY_NAV.COOKIES.URL} component={CookiesPage} />

        <Route path={UTILS.DRY_NAV.DEMO.URL} component={DemoPage} />

        <Route path={UTILS.DRY_NAV.ONBOARDING_UPLOAD.URL} component={OnboardingUploadPage} />
        <Route path={UTILS.DRY_NAV.COLLECTIONS.URL} component={CollectionsMainPage} />

        <Route path="/timeline/:timelineId" component={TimelinePage} />

        <Route path={UTILS.DRY_NAV.NOT_FOUND.URL} component={NotFoundPage} />

        <Route path="*" component={NotFoundPage} />

    </Router>
), document.querySelector('#wonderland'));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
