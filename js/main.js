(function () {
  var babies = ['Charlotte', 'Abby'];
  var latest = window.ls.get('latest-feedings');
  var history = window.ls.get('feedings');
  var emojifier = document.querySelector('.emojifier');

  var pickLatestFeedings = function (sortedGroupedFeedings, babies) {
    var tmp = [];

    babies.forEach(function (baby) {
      for (var i = 0; i < sortedGroupedFeedings[baby].length; i++) {
        var f = sortedGroupedFeedings[baby][i];
        if (_.contains(f.diaper, 'poop')) {
          var hoursSincePoop = moment(Date.now()).diff(f.time, 'hours');
          var poopFlag = poo.cloneNode(true);
          if (hoursSincePoop < 24) {
            sortedGroupedFeedings[baby][0].poopFlag = 0;
          } else if (hoursSincePoop < 72) {
            sortedGroupedFeedings[baby][0].poopFlag = 1;
          } else {
            sortedGroupedFeedings[baby][0].poopFlag = 2;
          }
          break;
        }
      }
      tmp.push(sortedGroupedFeedings[baby][0]);
    });

    return ls.set('latest-feedings', tmp);
  };

  var runEmoji = function (el) {
    emojify.setConfig({
      img_dir: '/bower_components/emojify/dist/images/basic',
    });
    emojify.run(el);
    var emo = emojifier.cloneNode(true);
    emo.style.display = 'inline';
    return emo;
  };

  var colorPoop = function () {
    var poopers = document.querySelectorAll('.replace-poop');
    [].forEach.call(poopers, function (pooper) {
      var newPoo = poo.cloneNode(true);
      var pooLevel = parseInt(pooper.getAttribute('data-poop'));
      if (pooLevel === 0) {
        newPoo.classList.add('ok');
      } else if (pooLevel === 1) {
        newPoo.classList.add('warn');
      } else {
        newPoo.classList.add('uh-oh');
      }
      pooper.parentNode.appendChild(newPoo);
      pooper.parentNode.removeChild(pooper);
    });
  };

  var poo = runEmoji(emojifier);

  if (history) {
    latest = pickLatestFeedings(history, babies);
  }

  var loadHomeScreen = function () {
    qwest.get('/api/feedings')
      .then(function (feedings) {
        if (!history || JSON.stringify(history) !== JSON.stringify(feedings)) {
          history = ls.set('feedings', feedings);
          latest = pickLatestFeedings(history, babies);
          renderIntoTemplate('overall-info', 'baby-info', latest, function () {
            colorPoop();
          });
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  loadHomeScreen();

  window.loadTemplates(function () {
    renderIntoTemplate('overall-info', 'baby-info', latest, function () {
      colorPoop();
    });
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

    runEmoji(emojifier);

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

    var getValFromNodeList = function (nodes) {
      var val = '';
      for (var i = 0; i < nodes.length; i++) {
        if (i > 0) {
          val += ' + ' + nodes[i].value;
        } else {
          val += nodes[i].value;
        }
      }
      return val;
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
        var baby = feedForm.dataset.baby;
        var amountEls = feedForm.querySelectorAll('.stepper span');
        var burp = feedForm.querySelector('input[name="burp"]:checked');
        var diaper = feedForm.querySelectorAll('input[name="diaper"]:checked');
        var meds = feedForm.querySelectorAll('input[name="medicine"]:checked');
        var timeAgo = feedForm.querySelector('input[name="time"]:checked');
        var spit = feedForm.querySelector('input[name="spit"]:checked');
        var wholeNum = parseInt(amountEls[0].textContent);
        var fracNum = parseFloat(fractionToDecimal(amountEls[1].textContent));

        var feeding = {
          amount: (wholeNum + fracNum),
          name: baby,
          burp: burp.value,
          diaper: getValFromNodeList(diaper),
          medicine: getValFromNodeList(meds),
          spit: spit.value,
          time: moment(new Date()).subtract(parseInt(timeAgo.value), 'minutes').format()
        };

        qwest.post('/api/feedings', feeding)
          .then(function() {
            closeModalSheet();
            loadHomeScreen();
          });
      };

      feedForm.addEventListener('click', function(e) {
        var el, stepperSpan;

        el = e.target;

        if (el.classList.contains('btn')) {
          e.preventDefault();
          if (el.classList.contains('submit-btn')) {
            el.disabled = true;
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
