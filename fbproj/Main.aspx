<%@ page language="C#" autoeventwireup="true" codefile="Test.aspx.cs" inherits="Test" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script src="Scripts/knockout-2.3.0.js" type="text/javascript"></script>
    <script src="Scripts/jquery-2.0.3.js" type="text/javascript"></script>
    <script src="Scripts/jquery-ui-1.10.3.js" type="text/javascript"></script>
    <script src="Scripts/three.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.contextMenu.js" type="text/javascript"></script>
    <script src="Scripts/jquery.ui.position.js" type="text/javascript"></script>
    <script src="Scripts/knockout.command.js" type="text/javascript"></script>
    <script src="ViewModel/CustomBinding.js" type="text/javascript"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlZIXVWAsVu28gVqzY3OKNrwjgd-bxguM&sensor=false"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>

    <link href="css/jquery.contextMenu.css" rel="stylesheet" type="text/css" />
    <link href="css/CommandPanel.css" rel="stylesheet" type="text/css" />
    <link href="css/ContentArea.css" rel="stylesheet" type="text/css" />
    <!--<link href="css/Tabs.css" rel="stylesheet" type="text/css" />-->
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
    <link href="css/FriendsPanel.css" rel="stylesheet" type="text/css" />
    <script src="Communications/GoogleMaps.js" type="text/javascript"></script>
    <script src="Communications/WeatherAPI.js" type="text/javascript"></script>
    <script src="Communications/Facebook.js" type="text/javascript"></script>
    <script src="Communications/GoogleSearch.js" type="text/javascript"></script>
    <script src="ViewModel/FacebookNetworkVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM/BasicContentVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM/LocationContentVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM/PostsContentVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM/WeatherContentVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM/GoogleSearchContentVM.js" type="text/javascript"></script>
    <script src="ViewModel/ContentAreaVM.js" type="text/javascript"></script>
    <script src="ViewModel/FriendsPanelVM.js" type="text/javascript"></script>
    <script src="ViewModel/CommandPanelVM.js" type="text/javascript"></script>
    <script src="ViewModel/MainVM.js" type="text/javascript"></script>
    <script type="text/javascript">
    function pageLoaded(FBresponse) {
        $(document).ready(function () {

            var VM = new MainVM();
            ko.applyBindings(VM);
            VM.initialize(FBresponse);

        });
        };
    </script>
</head>
<body style="cursor: default">
    <script src="ViewModel/FacebookConnection.js" type="text/javascript"></script>
    <div id="fb-root">
    </div>
    
    <!-- ko if: showFriendsPanel -->
    <div data-bind="template: {name: 'friendsPanelTmpl'}">
    </div>
    <!-- /ko -->
    <!-- ko if: showContentArea -->
    <div data-bind="template: {name: 'contentAreaTmpl'}"></div>
    <!-- /ko -->   
    <!-- ko if: showNetworkArea -->
    <div data-bind="template: {name: 'networkAreaTmpl'}"></div>
    <!-- /ko -->
    <!-- ko if: showCommandPanel -->
    <div data-bind="template: {name: 'commandPanelTmpl'}">
    </div>
    <!-- /ko -->
</body>
</html>
<script type="text/html" id="friendsPanelTmpl">
    <!-- ko with: friendsPanel -->

    <div id="friendsPanel">
    <div class="FBbar-friendsPanel"></div>
    <ul data-bind="foreach: friends">
        <li class="context-menu-one box menu-1" data-bind="text: $data.name, event: { dblclick: $parent.showFriend }, attr: {id: $data.uid}">    
        </li>
    </ul>
    <input type="text" data-bind="value: query, valueUpdate: 'keyup'" />
    <div data-bind="text: 'x', click: clearQueryField"></div>
    </div>
    <!-- /ko -->
</script>

<script type="text/html" id="contentAreaTmpl">
    <!-- ko with: contentArea -->
    <div id="contentArea">

       <div id="tabs" data-bind="if: tabPages().length > 0, tabsBinding: tabs">  
        <ul data-bind="foreach: tabPages">
            <li><a data-bind="text: $data.title, attr:{title: $data.title, href: $data.href}" ></a></li>
        </ul>
        <div id="container">
        <!-- ko foreach: tabPages -->
        <div data-bind="attr:{id: $data.id}, template: {name: function () { return ('contentArea' + $data.templateName + 'TabTmpl');}, afterRender: $parent.showViewForSelectedTab($data) }"></div>
        <!-- /ko -->
        </div>
    </div>
    </div>
     <!-- /ko -->

</script>

<script type="text/html" id="contentAreaBasicTabTmpl">
    <!-- ko with: $parent.BasicContent -->
    <img class="person-img" data-bind="attr: {src: user().pic_square}, click: showBigPic" />
    <img class="person-img-big" data-bind="attr: {src: user().pic}, click: showSmallPic" />
    <div class="person-info-value" data-bind="text: user().name"></div>
    <br />
    <ul class="info-for-person">
        <li><span class="person-info-key">Lives in &nbsp</span><span data-bind="text: user().current_location.name"></span></li>
        <li><span class="person-info-key">From &nbsp</span><span data-bind="text: user().hometown_location.name"></span></li>
        <li><span class="person-info-key">Studies in &nbsp</span><span data-bind="text: user().education[1].school.name"></span></li>
        <li><span class="person-info-key">Studied in &nbsp</span><span data-bind="text: user().education[0].school.name"></span></li>
    </ul>
    <!-- /ko -->

    <!-- ko if: $parent.shouldShowCloseButton -->
        <button data-bind="click: $parent.switchViewToLoggedInUser" class="closeButton">Close</button>
    <!-- /ko -->   
</script>
<script type="text/html" id="contentAreaLocationTabTmpl">
<!-- ko with: $parent.LocationContent -->
    
    <!-- ko with: user().current_location -->
    <div data-bind="text: name">location tab chosen</div>
    <!-- /ko -->
    <div id="map-canvas"></div>
         
<!-- /ko -->
<!-- ko if: $parent.shouldShowCloseButton -->
        <button data-bind="click: $parent.switchViewToLoggedInUser" class="closeButton">Close</button>
    <!-- /ko -->   

</script>
<script type="text/html" id="contentAreaWeatherTabTmpl">
    <!-- ko with: $parent.WeatherContent -->
    <div id="weatherContent">
        <div data-bind="text: weather().location"></div>    
        <br/><div>Local time: <span data-bind="text: weather().time"></span></div>
        <br/><span class="weather-icon-temp-type"><img data-bind="attr: {src: weather().icon}" />
        <div data-bind="text: weather().temperature" class="temperature"></div>
        <div data-bind="text: weather().weatherType" ></div></span>
    </div>
    <!-- /ko -->
    <!-- ko if: $parent.shouldShowCloseButton -->
        <button data-bind="click: $parent.switchViewToLoggedInUser" class="closeButton">Close</button>
    <!-- /ko --> 

</script>
<script type="text/html" id="contentAreaPostsTabTmpl">
<!-- ko with: $parent.PostsContent -->
    
    <!-- ko if: !user().posts || user().posts.length == 0 -->
    <div> no status updates for the last 30 days</div>
    <!-- /ko -->

    <!-- ko if: user().posts && user().posts.length != 0 -->
    <ul data-bind="foreach: user().posts">
        <li data-bind="text: message"></li>
    </ul>
    <!-- /ko -->
    
<!-- /ko -->
<!-- ko if: $parent.shouldShowCloseButton -->
    <button data-bind="click: $parent.switchViewToLoggedInUser" class="closeButton">Close</button>
<!-- /ko -->
</script>

<script type="text/html" id="networkAreaTmpl">
    <!-- ko with: networkArea -->
    
     <div id="container" style="border: 0px solid black; width: 500px; height: 0px;z-index: 1;">
     <button data-bind="click: showContentArea">Close</button>
    </div>
    
    <!-- /ko -->
</script>

<script type="text/html" id="contentAreaGoogleSearchTabTmpl">
    <!-- ko if: $parent.shouldShowCloseButton -->
        <button data-bind="click: $parent.switchViewToLoggedInUser" class="closeButton">Close</button>
    <!-- /ko -->
    <!-- ko with: $parent.GoogleSearchContent -->

    <div id="googleSearchArea">
        <div id="searchcontrol">Loading...</div>
    </div>
    <!-- /ko -->
</script>

<script type="text/html" id="commandPanelTmpl">
    <!-- ko with: commandPanel -->
    <div id="commandPanel">
        <!-- <div class="FBbar-commandPanel"></div>-->
        <div class="logButton" data-bind="text: logMenu().title, click: logMenu().event"></div><br/>
        <div data-bind="visible: logMenu() == LogButton.Connected, click: onFacebookNetworkChosen">Draw network</div>
    </div>
    <!-- /ko -->
    
</script>

