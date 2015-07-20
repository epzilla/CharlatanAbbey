(function () {
  var babies = ['Charlotte', 'Abby'];
  var latest = window.ls.get('latest-feedings');
  var history = window.ls.get('feedings');

  console.log(history);
  console.log(latest);

  var pickLatestFeedings = function (sortedGroupedFeedings, babies) {
    var tmp = [];

    babies.forEach(function (baby) {
      tmp.push(sortedGroupedFeedings[baby][0]);
    });

    return ls.set('latest-feedings', tmp);
  };

  if (history) {
    latest = pickLatestFeedings(history, babies);
  }

  qwest.get('/api/feedings')
    .then(function (feedings) {
      if (!history || history.toString() !== feedings.toString()) {
        history = ls.set('feedings', feedings);
        latest = pickLatestFeedings(history, babies);
        renderIntoTemplate('overall-info', 'baby-info', latest);
      }
    })
    .catch(function (err) {
      console.error(err);
    });

  window.loadTemplates(function () {
    renderIntoTemplate('overall-info', 'baby-info', latest);

    var modalSheet = document.querySelector('.modal-sheet');
    var actionSheet = document.querySelector('.action-sheet');
    var rightSheet = document.querySelector('.right-sheet');
    var logBtn = document.querySelector('#log-btn');
    var historyBtn = document.querySelector('#history-btn');
    var hammerRightSheet = new Hammer(rightSheet);
    var fractionalPointer = 0;
    var fractionalSteps = [
      {
        displayValue: '--',
        actualValue: 0
      },
      {
        displayValue: '¼',
        actualValue: 0.25
      },
      {
        displayValue: '⅓',
        actualValue: 0.33
      },
      {
        displayValue: '½',
        actualValue: 0.5
      },
      {
        displayValue: '⅔',
        actualValue: 0.66
      },
      {
        displayValue: '¾',
        actualValue: 0.75
      }
    ];

    var closeRightSheet = function () {
      rightSheet.classList.remove('show');
    };

    var closeModalSheet = function () {
      modalSheet.classList.remove('show');
      window.scroll(0, 0);
    };

    var fractionToDecimal = function (frac) {
      return _.find(fractionalSteps, {displayValue: frac}).actualValue;
    };

    var getValsFromNodeList = function (nodes) {
      var vals = [];
      [].forEach.call(nodes, function(node) {
        vals.push(node.value);
      });
      return vals;
    };

    var setFeedFormHandlers = function () {
      actionSheet.classList.remove('show');
      modalSheet.classList.add('show');
      var feedForm = document.getElementById('feed-form');
      var feedFormHammer = new Hammer(feedForm);

      var stepUp = function (stepperEl) {
        if (stepperEl.parentNode.classList.contains('stepper-full')) {
          stepperEl.textContent = parseInt(stepperEl.textContent) + 1;
        } else {
          if (fractionalPointer === fractionalSteps.length - 1) {
            fractionalPointer = 0;
          } else {
            fractionalPointer++;
          }
          stepperEl.textContent = fractionalSteps[fractionalPointer].displayValue;
        }
      };

      var stepDown = function (stepperEl) {
        if (stepperEl.parentNode.classList.contains('stepper-full')) {
          stepperEl.textContent = parseInt(stepperEl.textContent) - 1;
        } else {
          if (fractionalPointer === 0) {
            fractionalPointer =  fractionalSteps.length - 1;
          } else {
            fractionalPointer--;
          }
          stepperEl.textContent = fractionalSteps[fractionalPointer].displayValue;
        }
      };

      var submitFeedForm = function () {
        var amountEls = feedForm.querySelectorAll('.stepper span');
        var burp = feedForm.querySelector('input[name="burp"]:checked');
        var diaper = feedForm.querySelectorAll('input[name="diaper"]:checked');
        var meds = feedForm.querySelectorAll('input[name="medicine"]:checked');
        var timeAgo = feedForm.querySelector('input[name="time"]:checked');
        var spit = feedForm.querySelector('input[name="spit"]:checked');
        var wholeNum = parseInt(amountEls[0].textContent);
        var fracNum = parseFloat(fractionToDecimal(amountEls[1].textContent));

        console.log({
          amount: (wholeNum + fracNum),
          burp: burp.value,
          diaper: getValsFromNodeList(diaper),
          medicine: getValsFromNodeList(meds),
          spit: spit.value,
          time: moment(new Date()).subtract(parseInt(timeAgo.value), 'minutes').format()
        });
        closeModalSheet();
      };

      feedForm.addEventListener('click', function(e) {
        var el, stepperSpan;

        el = e.target;

        if (el.classList.contains('btn')) {
          e.preventDefault();
          if (el.classList.contains('submit-btn')) {
            submitFeedForm();
          } else if (el.classList.contains('btn-cancel')) {
            closeModalSheet();
          } else if (el.classList.contains('top-btn')) {
            stepperSpan = e.target.parentNode.querySelector('span');
            stepUp(stepperSpan);
          } else if (el.classList.contains('bottom-btn')) {
            stepperSpan = e.target.parentNode.querySelector('span');
            stepDown(stepperSpan);
          }
        } else if (el.nodeName === 'I') {
          e.preventDefault();
          var parent = el.parentNode;
          direction = parent.getAttribute('data-direction');
          stepperSpan = parent.parentNode.querySelector('span');

          if (direction && stepperSpan) {
            if (direction === 'up') {
              stepUp(stepperSpan);
            } else {
              stepDown(stepperSpan);
            }
          }
        }
      });

      feedForm.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    };

    var setFeedClickHandlers = function () {
      var feedBtnContainer = document.getElementById('action-sheet');

      feedBtnContainer.addEventListener('click', function (e) {
        if (e.target.nodeName === 'BUTTON') {
          renderIntoTemplate('feed-info', 'modal-sheet', {
            baby: e.target.getAttribute('data-baby')
          }, function () {
            setFeedFormHandlers();
          });
        }
      });
    };

    logBtn.addEventListener('click', function (e) {
      renderIntoTemplate('feed-btns', 'action-sheet', latest, function () {
        actionSheet.classList.add('show');
        setFeedClickHandlers();
      });
    });

    historyBtn.addEventListener('click', function () {
      renderIntoTemplate('history', 'right-sheet', history, function () {
        rightSheet.classList.add('show');

        document.getElementById('feeding-list').innerHTML = JSON.stringify(history);

        var closeBtn = document.querySelector('.close-btn');
        closeBtn.addEventListener('click', function (e) {
          closeRightSheet();
        });
      });
    });

    hammerRightSheet.on('swiperight', function (e) {
      closeRightSheet();
    });
  });

})();
