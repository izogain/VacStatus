<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  {{ HTML::style('css/bootstrap.css') }}
  {{ HTML::style('css/global.css') }}
  {{ HTML::style('http://fonts.googleapis.com/css?family=Open+Sans:400,300,600') }}

  <title>
  VacStatus
  @section('title')
  @show
  </title>
  @section('head')
  @show
</head>
<body>
  <img src="/favicon.png" class="hidden">
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
      <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        <a class="navbar-brand" href="{{{ URL::route('home') }}}">VacStatus</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li><a href="{{{ URL::route('news') }}}">Site News</a></li>
          <li><a href="{{{ URL::route('most') }}}">Most Tracked</a></li>
          <li><a href="{{{ URL::route('latest') }}}">Latest Added</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          @if(Session::get('user.in'))
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{{ Session::get('user.name') }}} <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="{{{ URL::route('user', array( Session::get('user.communityId') )) }}}">Profile</a></li>
              <li class="divider"></li>
              <li><a href="{{{ URL::route('subscribe') }}}">Notification</a></li>
              @if(Session::get('user.admin'))
              <li class="divider"></li>
              <li><a href="{{{ URL::route('admin.index') }}}">Admin Panel</a></li>
              @endif
            </ul>
          </li>
            <li><a href="{{{ URL::route('logout') }}}">Logout</a></li>
          @else
            <li><a href="{{{ URL::route('login') }}}">Login with Steam</a></li>
          @endif
        </ul>
      </div>
    </div>
  </div>
  <div class="container main-container">
    @if (Session::get('error'))
      <p class="bg-danger search-error"><span class="text-danger">Error : </span>{{ Session::get('error') }}</p>
    @elseif (Session::get('success'))
      <p class="bg-success search-error"><span class="text-success">Success : </span>{{ Session::get('success') }}</p>
    @endif
    @section('content')
    @show
  </div>
  <div id="footer">
    <div class="container">
      <p class="col-md-6 text-muted copyright">&copy; 2014 VacStatus &middot; <a href="https://github.com/jung3o/VacStatus" target="_blank">Github</a> &middot; <a href="http://jung3o.com" target="_blank">Jung Oh</a> ( <a href="http://steamcommunity.com/id/Jung3o/" target="_blank">Steam</a> &middot; <a href="http://facepunch.com/member.php?u=451226" target="_blank">Facepunch</a> &middot; <a href="http://www.reddit.com/user/jung3o/" target="_blank">Reddit</a> )</p>
      <p class="col-md-6 text-muted copyright text-right">
         <a href="/privacy">Privacy Policy</a> &middot; Powered By <a href="http://steampowered.com" target="_blank">Steam</a>
      </p>
    </div>
  </div>
  {{ HTML::script('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js') }}
  {{ HTML::script('js/bootstrap.min.js') }}
  {{ HTML::script('js/global.js') }}
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-50795838-1', 'vacstatus.com');
    ga('require', 'displayfeatures');
    ga('send', 'pageview');
  </script>

  <script>(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/L36sOvpl12GBt8Lf0BDk3A.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})()</script>

  <script>
    UserVoice = window.UserVoice || [];
    UserVoice.push(['showTab', 'classic_widget', {
      mode: 'full',
      primary_color: '#cc6d00',
      link_color: '#007dbf',
      default_mode: 'feedback',
      forum_id: 249952,
      tab_label: 'Feedback & Support',
      tab_color: '#04b2d9',
      tab_position: 'middle-left',
      tab_inverted: false
    }]);
  </script>
  @section('script')
  @show
</body>
</html>
