/// OLED Constructor.
	///
	/// \param	module_name	String <"OLED">	OLED
	/// \param	enable_rate_filter	Bool <true>	Whether or not to impose maximum update rate
	/// \param	min_filter_delay	Int [50-5000] <300>	Minimum update delay, if enable_rate_filter enabled
	/// \param	type	Set(OLED_Version)	{0("Featherwing"), 1("Breakout")} <0>	Which version of the OLED is being used
	/// \param	reset_pin	Set(Int)	{5, 6, 9, 10, 11, 12, 13, A0, A1, A2, A3, A4, A5} <A0>	Which pin should be used for reseting. Only applies to breakout version
	/// \param	display_format	Set(OLED_Format)	{0("4 pairs"), 1("8 pairs"), 2("Scrolling")}	How to display the key value pairs of a bundle
	/// \param	scroll_duration	Int[500-30000] <6000>	The time (ms) to complete full scroll cycle if display_format is SCROLL
	/// \param	freeze_pin	Set(Int) {5, 6, 9, 10, 11, 12, 13, A0, A1, A2, A3, A4, A5} <10>	Which pin should be used to pause the display
	/// \param	freeze_behavior	Set(OLED_Freeze_Pin) {O("Disable"), 1("Pause Data"), 2("Pause Data and Scroll")} <2>	How freezing the display should behave

{
  ...
  'components': {
    ...
    'CommPlats':
      'OLED':
        'description': '...',
        'parameters': {
          'module_name': {
            'type': 'String',
            'range': [A-Za-z0-9_],
            'value': 'OLED',
            'Description': 'OLED Module Name'
          },
          'enable_rate_filter': {
            'type': 'Bool',
            'range': [true, false]
            'value': true,
            'Description': 'Whether or not to impose maximum update rate'
          },
          'min_filter_delay': {
            'type': Int,

          }


          }
        }
      {
    }
  }
