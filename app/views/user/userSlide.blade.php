@section('userSlide')
  @if(!empty($vBanUser) && is_object($vBanUser))
    <td><img src="{{{ $vBanUser->steam_avatar_url_small }}}"></td>
    <td>{{{ $vBanUser->display_name }}}</td>
    @if (!isset($searching))
    <td>{{{ date('m/d/Y', strtotime($vBanUser->created_at)) }}}</td>
    @endif
    @if($vBanUser->vac_banned > -1)
    <td class="text-danger text-center"><span class="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;{{{ date('m/d/Y', time()-($vBanUser->vac_banned*86400)) }}}</td>
    @else
    <td class="text-success text-center"><span class="glyphicon glyphicon-remove"></span></td>
    @endif
    <td class="text-center">{{{ vBanList::wherevBanUserId($vBanUser->id)->count()+(isset($vBanUser->is_tracking) && $vBanUser->is_tracking ? -1: 0) }}}</td>
    <td><a href="{{ URL::route('user', array( $vBanUser->community_id )) }}" target="_blank" type="button" class="btn btn-info btn-sm">Info</a></td>
    <td>
      @if (Session::get('user.in'))
        @if (isset($searching))
          @if($vBanUser->is_tracking)
            {{ Form::open(array('route' => 'remove', 'target' => '_blank')) }}
            {{ Form::hidden('vBanUserId', $vBanUser->id) }}
            <input type="submit" class="btn btn-danger btn-sm" value="Delete">
            {{ Form::close() }}
          @else
            {{ Form::open(array('route' => 'add', 'target' => '_blank')) }}
            {{ Form::hidden('vBanUserId', $vBanUser->id) }}
            <input type="submit" class="btn btn-info btn-sm" value="Add">
            {{ Form::close() }}
          @endif
        @else
          {{ Form::open(array('route' => 'remove')) }}
            {{ Form::hidden('vBanUserId', $vBanUser->id) }}
            <input type="submit" class="btn btn-danger btn-sm" value="Delete">
          {{ Form::close() }}
        @endif
      @endif
    </td>
  @endif
@stop
